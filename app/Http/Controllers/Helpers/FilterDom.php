<?php
namespace App\Http\Controllers\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FilterDom
{
    private string $storageDisk = 'public';

    private string $storageDirectory = 'appnews';

    public function __construct()
    {

    }

    /*==============================================================================
    One practical note: some websites block server-side image fetching with hotlink/CDN rules,
    so you should expect a few remote images to remain external when that happens.
    ================================================================================*/
    public function filterDOM($content): string
    {
        if (! is_string($content) || trim($content) === '') {
            return '';
        }

        $doc = $this->createDocument();
        $doc->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));

        $images = iterator_to_array($doc->getElementsByTagName('img'));
        $savedPaths = [];

        try {
            foreach ($images as $image) {
                $src = trim($image->getAttribute('src'));

                if ($src === '') {
                    continue;
                }

                if (str_starts_with($src, 'data:image/')) {
                    $imageData = $this->parseBase64ImageSource($src);
                    $relativePath = $this->storeImageBinary($imageData['binary'], $imageData['extension']);

                    $savedPaths[] = $relativePath;
                    $image->setAttribute('src', Storage::url($relativePath));
                    continue;
                }

                if ($this->isRemoteImageUrl($src)) {
                    $imageData = $this->downloadRemoteImage($src);

                    if ($imageData === null) {
                        continue;
                    }

                    $relativePath = $this->storeImageBinary($imageData['binary'], $imageData['extension']);
                    $savedPaths[] = $relativePath;
                    $image->setAttribute('src', Storage::url($relativePath));
                }
            }
        } catch (\Throwable $e) {
            if ($savedPaths !== []) {
                Storage::disk($this->storageDisk)->delete($savedPaths);
            }

            throw $e;
        }

        return $this->extractBodyHtml($doc);
    }

    public function removeImagesFromDOM($content) {

        $doc = $this->createDocument();
        $htmlContent = $content ? $content : '';
        $doc->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'));
        $images = $doc->getElementsByTagName('img');

        foreach ($images as $image) {
            $src = $image->getAttribute('src');

            if (! is_string($src) || trim($src) === '') {
                continue;
            }

            $path = parse_url($src, PHP_URL_PATH);
            $fileImageName = basename($path ?: '');

            if ($fileImageName === '' || $fileImageName === '.' || $fileImageName === '..') {
                continue;
            }

            $relativePath = $this->storageDirectory . '/' . $fileImageName;

            if (Storage::disk($this->storageDisk)->exists($relativePath)) {
                Storage::disk($this->storageDisk)->delete($relativePath);
            }
        }
    }

    /*

    public function htmlToPlainText(string $html): string
    {
        libxml_use_internal_errors(true);

        $dom = new \DOMDocument();
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);

        $text = $dom->textContent ?? '';

        return trim(preg_replace('/\s+/u', ' ', $text));
    } */

    public function htmlToPlainText(string $html): string
    {
        return trim(
            preg_replace('/\s+/u', ' ', strip_tags($html))
        );
    }

    private function createDocument(): \DOMDocument
    {
        libxml_use_internal_errors(true);
        libxml_clear_errors();

        $doc = new \DOMDocument('1.0', 'UTF-8');
        $doc->encoding = 'UTF-8';

        return $doc;
    }

    private function extractBodyHtml(\DOMDocument $doc): string
    {
        $html = $doc->saveHTML();
        $newDoc = $this->createDocument();
        $newDoc->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));

        $bodyNode = $newDoc->getElementsByTagName('body')->item(0);

        if ($bodyNode === null) {
            return '';
        }

        $output = new \DOMDocument('1.0', 'UTF-8');

        foreach ($bodyNode->childNodes as $node) {
            $output->appendChild($output->importNode($node, true));
        }

        return $output->saveHTML() ?: '';
    }

    private function parseBase64ImageSource(string $src): array
    {
        if (! preg_match('/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/s', $src, $matches)) {
            throw new \RuntimeException('Invalid base64 image source.');
        }

        $extension = strtolower($matches[1]);
        $extension = $extension === 'jpeg' ? 'jpg' : $extension;

        $allowedExtensions = ['jpg', 'png', 'gif', 'webp', 'bmp', 'svg+xml'];
        if (! in_array($extension, $allowedExtensions, true)) {
            throw new \RuntimeException('Unsupported image type.');
        }

        $binary = base64_decode($matches[2], true);
        if ($binary === false) {
            throw new \RuntimeException('Invalid base64 image payload.');
        }

        $extension = $extension === 'svg+xml' ? 'svg' : $extension;

        return [
            'extension' => $extension,
            'binary' => $binary,
        ];
    }

    private function isRemoteImageUrl(string $src): bool
    {
        if (! filter_var($src, FILTER_VALIDATE_URL)) {
            return false;
        }

        $scheme = strtolower((string) parse_url($src, PHP_URL_SCHEME));

        return in_array($scheme, ['http', 'https'], true);
    }

    private function downloadRemoteImage(string $src): ?array
    {
        try {
            $response = Http::timeout(10)
                ->retry(1, 200)
                ->withHeaders([
                    'User-Agent' => 'scienceph-be image fetcher',
                ])
                ->get($src);
        } catch (\Throwable $e) {
            return null;
        }

        if (! $response->successful()) {
            return null;
        }

        $contentType = strtolower(trim(explode(';', (string) $response->header('Content-Type'))[0]));
        if (! str_starts_with($contentType, 'image/')) {
            return null;
        }

        $binary = $response->body();
        if ($binary === '') {
            return null;
        }

        return [
            'extension' => $this->resolveImageExtension($contentType, $src),
            'binary' => $binary,
        ];
    }

    private function storeImageBinary(string $binary, string $extension): string
    {
        $fileName = Str::uuid()->toString() . '.' . $extension;
        $relativePath = $this->storageDirectory . '/' . $fileName;

        Storage::disk($this->storageDisk)->put($relativePath, $binary);

        return $relativePath;
    }

    private function resolveImageExtension(string $contentType, string $src = ''): string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/bmp' => 'bmp',
            'image/svg+xml' => 'svg',
        ];

        if (isset($map[$contentType])) {
            return $map[$contentType];
        }

        $path = (string) parse_url($src, PHP_URL_PATH);
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

        if (in_array($extension, $allowedExtensions, true)) {
            return $extension === 'jpeg' ? 'jpg' : $extension;
        }

        throw new \RuntimeException('Unsupported image type.');
    }

}
