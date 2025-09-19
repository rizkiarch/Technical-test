<?php

namespace App\Services;

use App\Models\Animal;
use App\Repositories\AnimalRepository;
use App\Repositories\CategoryRepository;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AnimalService
{
    protected $animalRepository;
    protected $categoryRepository;

    // Fixed hourly rate for all categories (Rp 100,000 per hour)
    const HOURLY_RATE = 100000;

    public function __construct(AnimalRepository $animalRepository, CategoryRepository $categoryRepository)
    {
        $this->animalRepository = $animalRepository;
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Get all animals with pagination
     */
    public function getAllAnimals(int $perPage = 15)
    {
        return $this->animalRepository->getAll($perPage);
    }

    /**
     * Get animal by ID
     */
    public function getAnimalById(string $id)
    {
        return $this->animalRepository->findById($id);
    }

    /**
     * Create new animal record
     */
    public function createAnimal(array $data, UploadedFile $photo = null)
    {
        if (!$this->categoryRepository->exists($data['category'])) {
            throw ValidationException::withMessages([
                'category' => ['The selected category is invalid.']
            ]);
        }

        if (!$photo) {
            throw ValidationException::withMessages([
                'photo' => ['Photo is required for animal registration.']
            ]);
        }

        $this->validatePhoto($photo);
        $photoPath = $this->uploadPhoto($photo);
        $data['photo'] = $photoPath;
        
        // Debug logging
        \Log::info('Photo upload debug:', [
            'original_name' => $photo->getClientOriginalName(),
            'photo_path' => $photoPath,
            'data_photo' => $data['photo'] ?? 'NOT_SET'
        ]);

        if (isset($data['time_registered'])) {
            $data['time_registered'] = Carbon::parse($data['time_registered']);
        } else {
            $data['time_registered'] = Carbon::now();
        }

        if (isset($data['time_out'])) {
            $data['time_out'] = Carbon::parse($data['time_out']);

            $data['cost_total'] = $this->calculateCost($data['time_registered'], $data['time_out']);
        } else {
            $data['time_out'] = null;
            $data['cost_total'] = null;
        }

        // Debug logging before create
        \Log::info('Creating animal with data:', [
            'photo' => $data['photo'] ?? 'NOT_SET',
            'all_data' => $data
        ]);

        return $this->animalRepository->create($data);
    }

    /**
     * Update animal record
     */
    public function updateAnimal(string $id, array $data, UploadedFile $photo = null)
    {
        $animal = $this->animalRepository->findById($id);
        if (!$animal) {
            return null;
        }

        // Validate category if provided
        if (isset($data['category']) && !$this->categoryRepository->exists($data['category'])) {
            throw ValidationException::withMessages([
                'category' => ['The selected category is invalid.']
            ]);
        }

        // Handle photo upload
        if ($photo) {
            $this->validatePhoto($photo);
            // Delete old photo if exists
            if ($animal->photo && Storage::disk('public')->exists($animal->photo)) {
                Storage::disk('public')->delete($animal->photo);
            }
            $data['photo'] = $this->uploadPhoto($photo);
        }

        // Validate time_out is after time_registered if provided
        if (isset($data['time_out'])) {
            $timeRegistered = isset($data['time_registered'])
                ? Carbon::parse($data['time_registered'])
                : $animal->time_registered;

            $timeOut = Carbon::parse($data['time_out']);

            if ($timeOut->lte($timeRegistered)) {
                throw ValidationException::withMessages([
                    'time_out' => ['Time out must be after the registered time.']
                ]);
            }

            // Calculate cost if time_out is updated
            $data['cost_total'] = $this->calculateCost($timeRegistered, $timeOut);
        }

        $updated = $this->animalRepository->update($id, $data);
        return $updated ? $this->animalRepository->findById($id) : null;
    }

    /**
     * Delete animal record
     */
    public function deleteAnimal(string $id)
    {
        $animal = $this->animalRepository->findById($id);
        if (!$animal) {
            return false;
        }

        // Delete photo if exists
        if ($animal->photo && Storage::disk('public')->exists($animal->photo)) {
            Storage::disk('public')->delete($animal->photo);
        }

        return $this->animalRepository->delete($id);
    }

    /**
     * Search animals
     */
    public function searchAnimals(string $query, int $perPage = 15)
    {
        return $this->animalRepository->search($query, $perPage);
    }

    /**
     * Get animals by category
     */
    public function getAnimalsByCategory(string $category, int $perPage = 15)
    {
        return $this->animalRepository->getByCategory($category, $perPage);
    }

    /**
     * Get checked in animals
     */
    public function getCheckedInAnimals(int $perPage = 15)
    {
        return $this->animalRepository->getCheckedIn($perPage);
    }

    /**
     * Get checked out animals
     */
    public function getCheckedOutAnimals(int $perPage = 15)
    {
        return $this->animalRepository->getCheckedOut($perPage);
    }

    /**
     * Checkout animal and calculate cost
     */
    public function checkoutAnimal(string $id, string $timeOut = null)
    {
        $animal = $this->animalRepository->findById($id);
        if (!$animal) {
            return null;
        }

        // Check if animal is already checked out
        if ($animal->time_out) {
            throw ValidationException::withMessages([
                'animal' => ['Animal is already checked out.']
            ]);
        }

        // Use provided time_out or current time
        $checkoutTime = $timeOut ? Carbon::parse($timeOut) : Carbon::now();

        // Validate time_out is after time_registered
        if ($checkoutTime->lte($animal->time_registered)) {
            throw ValidationException::withMessages([
                'time_out' => ['Checkout time must be after registration time.']
            ]);
        }

        // Calculate cost
        $costTotal = $this->calculateCost($animal->time_registered, $checkoutTime);

        // Update animal with checkout info
        $updateData = [
            'time_out' => $checkoutTime,
            'cost_total' => $costTotal
        ];

        $this->animalRepository->update($id, $updateData);

        return $this->animalRepository->findById($id);
    }

    /**
     * Get hourly rates
     */
    public function getHourlyRates()
    {
        return [
            'Anjing' => self::HOURLY_RATE,
            'Kucing' => self::HOURLY_RATE,
            'Kelinci' => self::HOURLY_RATE,
            'Reptil' => self::HOURLY_RATE,
            'Lainnya' => self::HOURLY_RATE
        ];
    }

    /**
     * Calculate cost based on time difference (fixed rate for all categories)
     */
    private function calculateCost(Carbon $timeRegistered, Carbon $timeOut): float
    {
        // Calculate hours difference (minimum 1 hour)
        $hoursDiff = $timeRegistered->diffInHours($timeOut);
        $hoursDiff = max(1, $hoursDiff); // Minimum 1 hour charge

        return $hoursDiff * self::HOURLY_RATE;
    }

    /**
     * Validate photo upload
     */
    private function validatePhoto(UploadedFile $photo)
    {
        $allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        $maxSize = 2048; // 2MB in KB

        if (!in_array($photo->getMimeType(), $allowedMimes)) {
            throw ValidationException::withMessages([
                'photo' => ['The photo must be a file of type: jpeg, png, jpg, gif.']
            ]);
        }

        if ($photo->getSize() > $maxSize * 1024) {
            throw ValidationException::withMessages([
                'photo' => ['The photo must not be larger than 2MB.']
            ]);
        }
    }

    /**
     * Upload photo to storage
     */
    private function uploadPhoto(UploadedFile $photo): string
    {
        try {
            // Generate unique filename
            $filename = time() . '_' . preg_replace('/[^A-Za-z0-9\-_.]/', '', $photo->getClientOriginalName());

            \Log::info('Upload photo debug:', [
                'original_name' => $photo->getClientOriginalName(),
                'generated_filename' => $filename,
                'photo_size' => $photo->getSize(),
                'photo_mime' => $photo->getMimeType(),
            ]);

            // Try Laravel's storeAs method first
            $path = $photo->storeAs('animals', $filename, 'public');
            
            if ($path === false || $path === null) {
                // Fallback: use move method
                $destinationPath = 'animals/' . $filename;
                $moved = $photo->move(storage_path('app/public/animals'), $filename);
                
                if ($moved) {
                    $path = $destinationPath;
                    \Log::info('File uploaded using move method');
                } else {
                    throw new \Exception('Both storeAs and move methods failed');
                }
            }

            \Log::info('Photo stored successfully:', [
                'path' => $path,
                'full_path' => storage_path('app/public/' . $path),
                'file_exists' => file_exists(storage_path('app/public/' . $path))
            ]);

            return $path;
        } catch (\Exception $e) {
            \Log::error('Photo upload failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return '';
        }
    }
}
