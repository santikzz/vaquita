<?php

namespace App\Models\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Shared media handling for models that store uploaded files in their own columns.
 *
 * Files live on the configured media disk (mediaDisk()) under mediaDir(), so swapping
 * local/s3/r2 needs no model changes. Columns store the raw relative path; expose the
 * public URL via a mediaUrl() accessor on each media attribute.
 */
trait HasMediaAssets
{
    // directory this model's media is grouped under, e.g. "users/{id}".
    abstract public function mediaDir(): string;

    public function replaceMedia(string $attribute, UploadedFile $file): void
    {
        $this->deleteMedia($attribute);
        $this->{$attribute} = $this->storeMedia($file);
    }

    public function deleteMedia(string $attribute): void
    {
        $path = $this->getRawOriginal($attribute);

        if (! $path) {
            return;
        }

        Storage::disk(mediaDisk())->delete($path);
        $this->{$attribute} = null;
    }

    public function deleteAllMedia(): void
    {
        Storage::disk(mediaDisk())->deleteDirectory($this->mediaDir());
    }

    private function storeMedia(UploadedFile $file): string
    {
        $name = Str::random(40).'.'.$file->getClientOriginalExtension();

        return $file->storeAs($this->mediaDir(), $name, mediaDisk());
    }
}
