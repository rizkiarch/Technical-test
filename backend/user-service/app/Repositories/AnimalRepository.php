<?php

namespace App\Repositories;

use App\Models\Animal;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AnimalRepository
{
    protected $model;

    public function __construct(Animal $model)
    {
        $this->model = $model;
    }

    /**
     * Get all animals with pagination
     */
    public function getAll(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with('category')
            ->orderBy('time_registered', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find animal by ID
     */
    public function findById(string $id): ?Animal
    {
        return $this->model->with('category')->find($id);
    }

    /**
     * Create new animal
     */
    public function create(array $data): Animal
    {
        return $this->model->create($data);
    }

    /**
     * Update animal
     */
    public function update(string $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    /**
     * Delete animal
     */
    public function delete(string $id): bool
    {
        return $this->model->where('id', $id)->delete();
    }

    /**
     * Search animals by query
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with('category')
            ->where(function ($q) use ($query) {
                $q->where('name_animal', 'like', "%{$query}%")
                    ->orWhere('name_owner', 'like', "%{$query}%")
                    ->orWhere('phone_owner', 'like', "%{$query}%")
                    ->orWhere('email_owner', 'like', "%{$query}%")
                    ->orWhere('id', 'like', "%{$query}%");
            })
            ->orderBy('time_registered', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get animals by category
     */
    public function getByCategory(string $category, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with('category')
            ->where('category', $category)
            ->orderBy('time_registered', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get checked in animals
     */
    public function getCheckedIn(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with('category')
            ->checkedIn()
            ->orderBy('time_registered', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get checked out animals
     */
    public function getCheckedOut(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->with('category')
            ->checkedOut()
            ->orderBy('time_out', 'desc')
            ->paginate($perPage);
    }

    /**
     * Check if animal exists
     */
    public function exists(string $id): bool
    {
        return $this->model->where('id', $id)->exists();
    }

    /**
     * Get animals count by category
     */
    public function getCountByCategory(): array
    {
        return $this->model->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();
    }
}
