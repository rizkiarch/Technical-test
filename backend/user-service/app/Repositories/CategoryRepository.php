<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    /**
     * Get all categories
     */
    public function getAll(): Collection
    {
        return $this->category->all();
    }

    /**
     * Get category by type
     */
    public function findByType(string $type): ?Category
    {
        return $this->category->find($type);
    }

    /**
     * Create new category
     */
    public function create(array $data): Category
    {
        return $this->category->create($data);
    }

    /**
     * Update category
     */
    public function update(string $type, array $data): bool
    {
        $category = $this->findByType($type);
        if (!$category) {
            return false;
        }

        return $category->update($data);
    }

    /**
     * Delete category
     */
    public function delete(string $type): bool
    {
        $category = $this->findByType($type);
        if (!$category) {
            return false;
        }

        return $category->delete();
    }

    /**
     * Get category with animals count
     */
    public function getCategoriesWithCount(): Collection
    {
        return $this->category->withCount('animals')->get();
    }

    /**
     * Check if category exists
     */
    public function exists(string $type): bool
    {
        return $this->category->where('type', $type)->exists();
    }
}
