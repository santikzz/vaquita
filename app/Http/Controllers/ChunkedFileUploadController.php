<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ChunkedFileUploadController extends Controller
{
    private const CHUNK_STORAGE_PATH = 'temp/chunks';

    private const FINAL_STORAGE_PATH = 'uploads';

    private const MAX_CHUNK_SIZE = 1024 * 1024 * 50; // 50 MB

    private const ALLOWED_EXTENSIONS = ['mp4', 'mov', 'avi', 'pdf', 'zip', 'jpg', 'png', 'gif', 'doc', 'docx'];

    // creates a new upload session and returns a unique session identifier
    public function initialize(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string|max:255',
            'total_size' => 'required|integer|min:1|max:53687091200',
            'total_chunks' => 'required|integer|min:1|max:50000',
            'mime_type' => 'nullable|string|max:127',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $sanitizedFilename = $this->sanitizeFilename($request->input('filename'));
        $extension = pathinfo($sanitizedFilename, PATHINFO_EXTENSION);

        if (! in_array(strtolower($extension), self::ALLOWED_EXTENSIONS)) {
            return response()->json([
                'success' => false,
                'message' => 'file type not allowed',
            ], Response::HTTP_FORBIDDEN);
        }

        $sessionId = Str::uuid()->toString();
        $metadata = [
            'filename' => $sanitizedFilename,
            'total_size' => $request->input('total_size'),
            'total_chunks' => $request->input('total_chunks'),
            'mime_type' => $request->input('mime_type'),
            'created_at' => now()->toIso8601String(),
        ];

        Storage::put(
            $this->getMetadataPath($sessionId),
            json_encode($metadata)
        );

        return response()->json([
            'success' => true,
            'session_id' => $sessionId,
        ], Response::HTTP_CREATED);
    }

    // receives and stores a single file chunk, merges all chunks when complete
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|uuid',
            'chunk_index' => 'required|integer|min:0',
            'chunk' => 'required|file|max:'.(self::MAX_CHUNK_SIZE / 1024),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $sessionId = $request->input('session_id');
        $chunkIndex = $request->input('chunk_index');

        if (! $this->sessionExists($sessionId)) {
            return response()->json([
                'success' => false,
                'message' => 'invalid session',
            ], Response::HTTP_NOT_FOUND);
        }

        $metadata = $this->getMetadata($sessionId);

        if ($chunkIndex >= $metadata['total_chunks']) {
            return response()->json([
                'success' => false,
                'message' => 'chunk index out of bounds',
            ], Response::HTTP_BAD_REQUEST);
        }

        $chunkPath = $this->getChunkPath($sessionId, $chunkIndex);

        if (Storage::exists($chunkPath)) {
            return response()->json([
                'success' => true,
                'message' => 'chunk already exists',
                'completed' => $this->isUploadComplete($sessionId, $metadata['total_chunks']),
            ]);
        }

        try {
            Storage::put(
                $chunkPath,
                $request->file('chunk')->get()
            );
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'failed to store chunk',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $isComplete = $this->isUploadComplete($sessionId, $metadata['total_chunks']);

        if ($isComplete) {
            $finalPath = $this->mergeChunks($sessionId, $metadata);

            if ($finalPath) {
                return response()->json([
                    'success' => true,
                    'completed' => true,
                    'file_path' => $finalPath,
                    'file_url' => Storage::url($finalPath),
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'merge operation failed',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            'success' => true,
            'completed' => false,
        ]);
    }

    // returns the list of already uploaded chunks for resume functionality
    public function status(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|uuid',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $sessionId = $request->input('session_id');

        if (! $this->sessionExists($sessionId)) {
            return response()->json([
                'success' => false,
                'message' => 'session not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $metadata = $this->getMetadata($sessionId);
        $uploadedChunks = $this->getUploadedChunkIndices($sessionId);

        return response()->json([
            'success' => true,
            'uploaded_chunks' => $uploadedChunks,
            'total_chunks' => $metadata['total_chunks'],
            'completed' => count($uploadedChunks) === $metadata['total_chunks'],
        ]);
    }

    // cancels an upload session and removes all associated chunks
    public function abort(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|uuid',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $sessionId = $request->input('session_id');

        if (! $this->sessionExists($sessionId)) {
            return response()->json([
                'success' => false,
                'message' => 'session not found',
            ], Response::HTTP_NOT_FOUND);
        }

        $this->cleanupSession($sessionId);

        return response()->json([
            'success' => true,
            'message' => 'upload aborted and cleaned up',
        ]);
    }

    // checks if a session metadata file exists in storage
    private function sessionExists(string $sessionId): bool
    {
        return Storage::exists($this->getMetadataPath($sessionId));
    }

    // retrieves and decodes the session metadata from storage
    private function getMetadata(string $sessionId): array
    {
        $content = Storage::get($this->getMetadataPath($sessionId));

        return json_decode($content, true);
    }

    // scans the chunk directory and returns sorted array of uploaded chunk indices
    private function getUploadedChunkIndices(string $sessionId): array
    {
        $chunkDir = $this->getChunkDirectory($sessionId);

        if (! Storage::exists($chunkDir)) {
            return [];
        }

        $files = Storage::files($chunkDir);

        return collect($files)
            ->filter(fn ($file) => str_ends_with($file, '.part'))
            ->map(fn ($file) => (int) basename($file, '.part'))
            ->sort()
            ->values()
            ->all();
    }

    // verifies all chunks from 0 to total are present without gaps
    private function isUploadComplete(string $sessionId, int $totalChunks): bool
    {
        $uploadedChunks = $this->getUploadedChunkIndices($sessionId);

        if (count($uploadedChunks) !== $totalChunks) {
            return false;
        }

        for ($i = 0; $i < $totalChunks; $i++) {
            if (! in_array($i, $uploadedChunks)) {
                return false;
            }
        }

        return true;
    }

    // combines all chunks sequentially into final file using temp file to prevent corruption
    private function mergeChunks(string $sessionId, array $metadata): ?string
    {
        $totalChunks = $metadata['total_chunks'];
        $filename = $metadata['filename'];

        $finalFilename = $this->generateUniqueFilename($filename);
        $finalPath = self::FINAL_STORAGE_PATH.'/'.$finalFilename;

        $tempMergePath = storage_path('app/temp_merge_'.$sessionId);

        try {
            $handle = fopen($tempMergePath, 'wb');

            if (! $handle) {
                return null;
            }

            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkPath = $this->getChunkPath($sessionId, $i);

                if (! Storage::exists($chunkPath)) {
                    fclose($handle);
                    @unlink($tempMergePath);

                    return null;
                }

                $chunkContent = Storage::get($chunkPath);
                fwrite($handle, $chunkContent);
            }

            fclose($handle);

            Storage::put($finalPath, file_get_contents($tempMergePath));
            @unlink($tempMergePath);

            $this->cleanupSession($sessionId);

            return $finalPath;

        } catch (\Exception $e) {
            if (isset($handle) && is_resource($handle)) {
                fclose($handle);
            }
            @unlink($tempMergePath);

            return null;
        }
    }

    // removes all chunks and metadata for a session to free storage space
    private function cleanupSession(string $sessionId): void
    {
        $chunkDir = $this->getChunkDirectory($sessionId);

        if (Storage::exists($chunkDir)) {
            Storage::deleteDirectory($chunkDir);
        }

        $metadataPath = $this->getMetadataPath($sessionId);

        if (Storage::exists($metadataPath)) {
            Storage::delete($metadataPath);
        }
    }

    // removes dangerous characters from filename and replaces with underscores
    private function sanitizeFilename(string $filename): string
    {
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
        $filename = preg_replace('/_+/', '_', $filename);

        return trim($filename, '_');
    }

    // generates timestamped unique filename to prevent overwrites
    private function generateUniqueFilename(string $originalFilename): string
    {
        $extension = pathinfo($originalFilename, PATHINFO_EXTENSION);
        $basename = pathinfo($originalFilename, PATHINFO_FILENAME);

        return $basename.'_'.time().'_'.Str::random(8).'.'.$extension;
    }

    // constructs path to session metadata json file
    private function getMetadataPath(string $sessionId): string
    {
        return self::CHUNK_STORAGE_PATH.'/'.$sessionId.'/metadata.json';
    }

    // constructs path to session chunks directory
    private function getChunkDirectory(string $sessionId): string
    {
        return self::CHUNK_STORAGE_PATH.'/'.$sessionId;
    }

    // constructs path to specific chunk file by index
    private function getChunkPath(string $sessionId, int $chunkIndex): string
    {
        return $this->getChunkDirectory($sessionId).'/'.$chunkIndex.'.part';
    }
}
