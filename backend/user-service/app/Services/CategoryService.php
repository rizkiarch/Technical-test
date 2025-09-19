<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Validation\ValidationException;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Get all categories
     */
    public function getAllCategories()
    {
        return $this->categoryRepository->getAll();
    }

    /**
     * Get categories with animal count
     */
    public function getCategoriesWithCount()
    {
        return $this->categoryRepository->getCategoriesWithCount();
    }

    /**
     * Get category by type
     */
    public function getCategoryByType(string $type)
    {
        return $this->categoryRepository->findByType($type);
    }

    /**
     * Create new category
     */
    public function create(array $data)
    {
        // Check if category already exists
        if ($this->categoryRepository->exists($data['type'])) {
            throw ValidationException::withMessages([
                'type' => ['This category type already exists.']
            ]);
        }

        return $this->categoryRepository->create($data);
    }

    /**
     * Update category
     */
    public function update(string $type, array $data)
    {
        $category = $this->categoryRepository->findByType($type);
        if (!$category) {
            throw ValidationException::withMessages([
                'type' => ['Category not found.']
            ]);
        }

        // If updating type, check if new type already exists
        if (isset($data['type']) && $data['type'] !== $type) {
            if ($this->categoryRepository->exists($data['type'])) {
                throw ValidationException::withMessages([
                    'type' => ['This category type already exists.']
                ]);
            }
        }

        $updated = $this->categoryRepository->update($type, $data);
        return $updated ? $this->categoryRepository->findByType($data['type'] ?? $type) : null;
    }

    /**
     * Delete category
     */
    public function delete(string $type)
    {
        $category = $this->categoryRepository->findByType($type);
        if (!$category) {
            throw ValidationException::withMessages([
                'type' => ['Category not found.']
            ]);
        }

        return $this->categoryRepository->delete($type);
    }

    /**
     * Check if category exists
     */
    public function exists(string $type): bool
    {
        return $this->categoryRepository->exists($type);
    }
}
