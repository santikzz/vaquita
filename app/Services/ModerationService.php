<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;

/*
 * Content moderation via the OpenAI moderation API (free endpoint, omni-moderation-latest).
 * Intended for internal use inside controllers/services (e.g. on post or comment creation),
 * not exposed as a frontend resource.
 *
 * Text:
 *   $result = $moderationService->moderateText('some user generated content');
 *
 * Image (max 20 MB) - accepts a public URL, a base64 data URI, a plain base64 string,
 * raw binary, or an uploaded file; everything except URLs is converted to a data URI:
 *   $result = $moderationService->moderateImage('https://example.com/image.png');
 *   $result = $moderationService->moderateImage('data:image/jpeg;base64,abcdefg...');
 *   $result = $moderationService->moderateImage($supplier->logo);            // base64 from db
 *   $result = $moderationService->moderateImage($request->file('image'));    // uploaded file
 *
 * Result shape (both methods):
 *   [
 *       'flagged'    => true,
 *       'score'      => 0.97,                                    // highest category score
 *       'category'   => 'violence',                              // highest scoring category
 *       'categories' => ['violence' => 0.97, 'hate' => 0.12, ...], // all scores, sorted desc
 *   ]
 *
 * Example usage in a controller/service:
 *   $result = $this->moderationService->moderateText($validated['content']);
 *   if ($result['flagged']) {
 *       return ResponseHelper::error('El contenido infringe las normas de la comunidad.', 422);
 *   }
 *
 * Categories: violence, violence/graphic, sexual, sexual/minors, hate, hate/threatening,
 * harassment, harassment/threatening, self-harm, self-harm/intent, self-harm/instructions,
 * illicit, illicit/violent.
 * Note: images are only evaluated against sexual, self-harm and violence categories;
 * text-only categories (hate, harassment, illicit, sexual/minors) score 0 for images.
 */
class ModerationService
{
    /**
     * Moderate user-generated text.
     *
     * @param  string  $text  the text to analyze
     * @return array{flagged: bool, score: float, category: string|null, categories: array<string, float>}
     *
     * @throws RuntimeException if the moderation api request fails
     */
    public function moderateText(string $text): array
    {
        return $this->moderate($text);
    }

    /**
     * Moderate an image. Accepts a public URL, a base64 data URI, a plain base64
     * string, raw binary contents, or an uploaded file from a request.
     *
     * @param  UploadedFile|string  $image  url, data uri, base64 string, raw binary, or uploaded file
     * @return array{flagged: bool, score: float, category: string|null, categories: array<string, float>}
     *
     * @throws InvalidArgumentException if the image format cannot be detected
     * @throws RuntimeException if the moderation api request fails
     */
    public function moderateImage(UploadedFile|string $image): array
    {
        return $this->moderate([
            [
                'type' => 'image_url',
                'image_url' => ['url' => $this->toImageUrl($image)],
            ],
        ]);
    }

    /**
     * Normalize any supported image input into a url or base64 data uri
     * accepted by the moderation api.
     */
    protected function toImageUrl(UploadedFile|string $image): string
    {
        if ($image instanceof UploadedFile) {
            return $this->toDataUri($image->getContent());
        }

        if (str_starts_with($image, 'data:image/') || preg_match('#^https?://#i', $image)) {
            return $image;
        }

        // plain base64 string (e.g. stored in db without the data uri prefix)
        $decoded = base64_decode($image, true);
        if ($decoded !== false && str_starts_with($this->detectMime($decoded), 'image/')) {
            return $this->toDataUri($decoded);
        }

        // raw binary contents
        return $this->toDataUri($image);
    }

    protected function toDataUri(string $binary): string
    {
        $mime = $this->detectMime($binary);

        if (! str_starts_with($mime, 'image/')) {
            throw new InvalidArgumentException("Unsupported image format: {$mime}");
        }

        return "data:{$mime};base64,".base64_encode($binary);
    }

    protected function detectMime(string $binary): string
    {
        return finfo_buffer(finfo_open(FILEINFO_MIME_TYPE), $binary) ?: 'unknown';
    }

    /**
     * @param  string|array<int, array<string, mixed>>  $input
     * @return array{flagged: bool, score: float, category: string|null, categories: array<string, float>}
     */
    protected function moderate(string|array $input): array
    {
        $response = Http::withToken(config('ai.providers.openai.key'))
            ->timeout(15)
            ->post(config('ai.providers.openai.url').'/moderations', [
                'model' => 'omni-moderation-latest',
                'input' => $input,
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Moderation API request failed: '.$response->body());
        }

        $result = $response->json('results.0');

        if (! $result) {
            throw new RuntimeException('Moderation API returned an empty result.');
        }

        $scores = $result['category_scores'] ?? [];
        arsort($scores);

        $topCategory = array_key_first($scores);

        return [
            'flagged' => (bool) ($result['flagged'] ?? false),
            'score' => $topCategory ? round($scores[$topCategory], 4) : 0.0,
            'category' => $topCategory,
            'categories' => array_map(fn ($score) => round($score, 4), $scores),
        ];
    }
}
