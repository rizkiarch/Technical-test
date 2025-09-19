<?php

namespace App\Helpers;

class IdHelper
{
    /**
     * Encode ID to base64 for KrakenD compatibility
     */
    public static function encode(string $id): string
    {
        return base64_encode($id);
    }

    /**
     * Decode base64 ID back to original format
     */
    public static function decode(string $encodedId): string
    {
        return base64_decode($encodedId);
    }

    /**
     * Check if ID contains problematic characters for URL routing
     */
    public static function hasProblematicChars(string $id): bool
    {
        return strpos($id, '/') !== false || strpos($id, '\\') !== false;
    }

    /**
     * Safely encode ID only if it contains problematic characters
     */
    public static function safeEncode(string $id): string
    {
        return self::hasProblematicChars($id) ? self::encode($id) : $id;
    }

    /**
     * Try to decode, if fails return original
     */
    public static function safeDecode(string $id): string
    {
        // Check if it looks like base64 (basic check)
        if (base64_encode(base64_decode($id, true)) === $id) {
            return base64_decode($id);
        }

        return $id;
    }
}
