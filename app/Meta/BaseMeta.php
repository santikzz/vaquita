<?php

namespace App\Meta;

/**
 * Base class for page meta tags (SEO, Open Graph, Twitter cards).
 *
 * Extend this and override getDefaults() to set site-wide defaults, then create
 * per-resource subclasses that merge page-specific values over those defaults.
 *
 * Subclass example:
 *
 *     class ProductMeta extends BaseMeta
 *     {
 *         public function __construct(private Product $product) {}
 *
 *         public function toArray(): array
 *         {
 *             return $this->merge([
 *                 'title' => $this->product->name,
 *                 'description' => $this->product->summary,
 *                 'og_image' => mediaUrl($this->product->image),
 *                 'canonical_url' => route('products.show', $this->product),
 *             ]);
 *         }
 *     }
 *
 * Inertia usage (shares meta with the page response):
 *
 *     return Inertia::render('storefront/product', [
 *         'product' => $this->present($product),
 *     ])->withMeta(new ProductMeta($product));
 *
 * Blade usage (renders the tags as an HTML string):
 *
 *     {!! (new BaseMeta)->render() !!}
 */
class BaseMeta
{
    public function toArray(): array
    {
        return $this->getDefaults();
    }

    // renders all meta tags as an HTML string for blade: {!! $meta_tags !!}
    public function render(): string
    {
        $data = $this->toArray();
        $tags = [];

        $name = ['description', 'keywords', 'author', 'robots', 'language'];

        $property = [
            'og:title', 'og:description', 'og:image', 'og:image:alt',
            'og:image:width', 'og:image:height', 'og:url', 'og:type',
            'og:site_name', 'og:locale',
        ];

        $keyMap = [
            'og_title' => 'og:title',            'og_description' => 'og:description',
            'og_image' => 'og:image',            'og_image_alt' => 'og:image:alt',
            'og_image_width' => 'og:image:width',      'og_image_height' => 'og:image:height',
            'og_url' => 'og:url',              'og_type' => 'og:type',
            'og_site_name' => 'og:site_name',        'og_locale' => 'og:locale',
            'twitter_card' => 'twitter:card',        'twitter_title' => 'twitter:title',
            'twitter_description' => 'twitter:description', 'twitter_image' => 'twitter:image',
        ];

        if (isset($data['canonical_url'])) {
            $tags[] = '<link rel="canonical" href="'.e($data['canonical_url']).'">';
        }

        foreach ($name as $key) {
            $dataKey = str_replace(':', '_', $key);
            $value = $data[$dataKey] ?? null;
            if ($value) {
                $tags[] = '<meta name="'.$key.'" content="'.e($value).'">';
            }
        }

        foreach ($keyMap as $dataKey => $tag) {
            $value = $data[$dataKey] ?? null;
            if (! $value) {
                continue;
            }
            $attr = in_array($tag, $property) ? 'property' : 'name';
            $tags[] = '<meta '.$attr.'="'.$tag.'" content="'.e($value).'">';
        }

        return implode("\n    ", $tags);
    }

    protected function getDefaults(): array
    {
        $name = config('app.name');
        $title = $name;
        $description = config('app.name').' application.';

        return [
            'title' => $title,
            'description' => $description,
            'keywords' => '',
            'author' => $name,
            'robots' => 'index, follow',
            'canonical_url' => url()->current(),
            'og_title' => $title,
            'og_description' => $description,
            'og_image_alt' => $name,
            'og_site_name' => $name,
            'og_type' => 'website',
            'twitter_card' => 'summary_large_image',
            'twitter_title' => $title,
            'twitter_description' => $description,
        ];
    }

    protected function merge(array $data): array
    {
        return array_merge($this->getDefaults(), $data);
    }
}
