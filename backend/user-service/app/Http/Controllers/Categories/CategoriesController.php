<?php

namespace App\Http\Controllers\Categories;

use App\Http\Controllers\Controller;
use App\Http\Requests\Categories\StoreCategoriesRequest;
use App\Http\Requests\Categories\UpdateCategoriesRequest;
use App\Services\CategoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CategoriesController extends Controller
{
    use ApiResponse;

    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of categories
     */
    public function index(): JsonResponse
    {
        try {
            $categories = $this->categoryService->getAllCategories();
            return $this->successResponse($categories, 'Categories retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve categories', 500);
        }
    }

    /**
     * Display categories with animal count
     */
    public function withCount(): JsonResponse
    {
        try {
            $categories = $this->categoryService->getCategoriesWithCount();
            return $this->successResponse($categories, 'Categories with count retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve categories with count', 500);
        }
    }

    /**
     * Store a newly created category
     */
    public function store(StoreCategoriesRequest $request): JsonResponse
    {
        try {
            $category = $this->categoryService->create($request->validated());
            return $this->successResponse($category, 'Category created successfully', 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create category', 500);
        }
    }

    /**
     * Display the specified category
     */
    public function show(string $type): JsonResponse
    {
        try {
            $category = $this->categoryService->getCategoryByType($type);

            if (!$category) {
                return $this->errorResponse('Category not found', 404);
            }

            return $this->successResponse($category, 'Category retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve category', 500);
        }
    }

    /**
     * Update the specified category
     */
    public function update(UpdateCategoriesRequest $request, string $type): JsonResponse
    {
        try {
            $category = $this->categoryService->update($type, $request->validated());

            if (!$category) {
                return $this->errorResponse('Category not found', 404);
            }

            return $this->successResponse($category, 'Category updated successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update category', 500);
        }
    }

    /**
     * Remove the specified category
     */
    public function destroy(string $type): JsonResponse
    {
        try {
            $deleted = $this->categoryService->delete($type);

            if (!$deleted) {
                return $this->errorResponse('Category not found', 404);
            }

            return $this->successResponse(null, 'Category deleted successfully');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete category', 500);
        }
    }
}
