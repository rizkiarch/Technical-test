<?php

namespace App\Http\Controllers\Animals;

use App\Http\Controllers\Controller;
use App\Http\Requests\Animals\StoreAnimalRequest;
use App\Http\Requests\Animals\UpdateAnimalRequest;
use App\Services\AnimalService;
use App\Traits\ApiResponse;
use App\Helpers\IdHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AnimalsController extends Controller
{
    use ApiResponse;

    protected $animalService;

    public function __construct(AnimalService $animalService)
    {
        $this->animalService = $animalService;
    }

    /**
     * Display a listing of animals with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $animals = $this->animalService->getAllAnimals($perPage);

            return $this->successResponse(
                $animals,
                'Animals retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve animals: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve animals', 500);
        }
    }

    /**
     * Store a newly created animal
     */
    public function store(StoreAnimalRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $photo = $request->file('photo');

            $animal = $this->animalService->createAnimal($data, $photo);

            return $this->successResponse(
                $animal->load('category'),
                'Animal registered successfully',
                201
            );
        } catch (\Exception $e) {
            Log::error('Failed to register animal: ' . $e->getMessage());
            return $this->errorResponse('Failed to register animal', 500);
        }
    }

    /**
     * Display the specified animal
     */
    public function show(string $id): JsonResponse
    {
        try {
            // Decode base64 ID if it's encoded for KrakenD compatibility
            $decodedId = IdHelper::safeDecode($id);

            $animal = $this->animalService->getAnimalById($decodedId);

            if (!$animal) {
                return $this->errorResponse('Animal not found', 404);
            }

            return $this->successResponse(
                $animal,
                'Animal retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve animal: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve animal', 500);
        }
    }

    /**
     * Update the specified animal
     */
    public function update(UpdateAnimalRequest $request, string $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $photo = $request->file('photo');

            $animal = $this->animalService->updateAnimal($id, $data, $photo);

            if (!$animal) {
                return $this->errorResponse('Animal not found', 404);
            }

            return $this->successResponse(
                $animal,
                'Animal updated successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to update animal: ' . $e->getMessage());
            return $this->errorResponse('Failed to update animal', 500);
        }
    }

    /**
     * Remove the specified animal
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Decode base64 ID if it's encoded for KrakenD compatibility
            $decodedId = IdHelper::safeDecode($id);

            $deleted = $this->animalService->deleteAnimal($decodedId);

            if (!$deleted) {
                return $this->errorResponse('Animal not found', 404);
            }

            return $this->successResponse(
                null,
                'Animal deleted successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to delete animal: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete animal', 500);
        }
    }

    /**
     * Search animals by query
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            $perPage = $request->get('per_page', 15);

            if (empty($query)) {
                return $this->errorResponse('Search query is required', 400);
            }

            $animals = $this->animalService->searchAnimals($query, $perPage);

            return $this->successResponse(
                $animals,
                'Animals search completed successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to search animals: ' . $e->getMessage());
            return $this->errorResponse('Failed to search animals', 500);
        }
    }

    /**
     * Get animals by category
     */
    public function getByCategory(string $category, Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $animals = $this->animalService->getAnimalsByCategory($category, $perPage);

            return $this->successResponse(
                $animals,
                "Animals in category '{$category}' retrieved successfully"
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve animals by category: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve animals by category', 500);
        }
    }

    /**
     * Get checked in animals
     */
    public function checkedIn(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $animals = $this->animalService->getCheckedInAnimals($perPage);

            return $this->successResponse(
                $animals,
                'Checked in animals retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve checked in animals: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve checked in animals', 500);
        }
    }

    /**
     * Get checked out animals
     */
    public function checkedOut(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 15);
            $animals = $this->animalService->getCheckedOutAnimals($perPage);

            return $this->successResponse(
                $animals,
                'Checked out animals retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve checked out animals: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve checked out animals', 500);
        }
    }

    /**
     * Checkout animal and calculate cost
     */
    public function checkout(Request $request, string $id): JsonResponse
    {
        try {
            // Decode base64 ID if it's encoded for KrakenD compatibility
            $decodedId = IdHelper::safeDecode($id);

            $timeOut = $request->get('time_out');
            $animal = $this->animalService->checkoutAnimal($decodedId, $timeOut);
            if (!$animal) {
                return $this->errorResponse('Animal not found', 404);
            }

            return $this->successResponse(
                $animal,
                'Animal checked out successfully'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Failed to checkout animal: ' . $e->getMessage());
            return $this->errorResponse('Failed to checkout animal', 500);
        }
    }

    /**
     * Get hourly rates for all categories
     */
    public function getHourlyRates(): JsonResponse
    {
        try {
            $rates = $this->animalService->getHourlyRates();

            return $this->successResponse(
                $rates,
                'Hourly rates retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve hourly rates: ' . $e->getMessage());
            return $this->errorResponse('Failed to retrieve hourly rates', 500);
        }
    }
}
