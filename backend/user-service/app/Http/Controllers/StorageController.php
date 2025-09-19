<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class StorageController extends Controller
{
    /**
     * Serve files from public storage
     */
    public function serveFile(Request $request, string $path): BinaryFileResponse|Response
    {
        try {
            // Security: prevent directory traversal
            $path = str_replace(['../', '..\\'], '', $path);
            
            // Full path to the file
            $fullPath = storage_path('app/public/' . $path);
            
            // Check if file exists
            if (!file_exists($fullPath) || !is_file($fullPath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'File not found'
                ], 404);
            }
            
            // Get file info
            $mimeType = mime_content_type($fullPath);
            $fileSize = filesize($fullPath);
            
            // Return file response
            return response()->file($fullPath, [
                'Content-Type' => $mimeType,
                'Content-Length' => $fileSize,
                'Cache-Control' => 'public, max-age=3600', // Cache for 1 hour
                'Expires' => gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error serving file: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get file info (metadata)
     */
    public function getFileInfo(Request $request, string $path): Response
    {
        try {
            $path = str_replace(['../', '..\\'], '', $path);
            $fullPath = storage_path('app/public/' . $path);
            
            if (!file_exists($fullPath) || !is_file($fullPath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'File not found'
                ], 404);
            }
            
            $fileInfo = [
                'path' => $path,
                'size' => filesize($fullPath),
                'mime_type' => mime_content_type($fullPath),
                'last_modified' => date('Y-m-d H:i:s', filemtime($fullPath)),
                'url' => url('/api/storage/' . $path)
            ];
            
            return response()->json([
                'status' => 'success',
                'data' => $fileInfo
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error getting file info: ' . $e->getMessage()
            ], 500);
        }
    }
}