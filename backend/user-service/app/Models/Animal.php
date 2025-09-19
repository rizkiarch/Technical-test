<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Animal extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'photo',
        'category',
        'name_animal',
        'name_owner',
        'phone_owner',
        'email_owner',
        'time_registered',
        'time_out',
        'cost_total'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'time_registered' => 'datetime',
        'time_out' => 'datetime',
        'cost_total' => 'decimal:2'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'id';
    protected $table = 'animals';

    /**
     * Boot function from Laravel
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = self::generateAnimalId($model->category);
            }
        });
    }

    /**
     * Generate unique animal ID based on format: YYMMDD/{Category}/no
     */
    public static function generateAnimalId($category)
    {
        $date = Carbon::now();
        $datePrefix = $date->format('ymd'); // YYMMDD format

        // Get the last animal for today with the same category
        $lastAnimal = self::where('id', 'like', $datePrefix . '/' . $category . '/%')
            ->orderBy('id', 'desc')
            ->first();

        $number = 1;
        if ($lastAnimal) {
            // Extract the number from the last ID
            $lastId = $lastAnimal->id;
            $parts = explode('/', $lastId);
            if (count($parts) === 3) {
                $number = (int)$parts[2] + 1;
            }
        }

        return $datePrefix . '/' . $category . '/' . str_pad($number, 3, '0', STR_PAD_LEFT);
    }

    /**
     * Relationship with Category model
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category', 'type');
    }

    /**
     * Get the full URL for the photo
     */
    public function getPhotoUrlAttribute()
    {
        if (!$this->photo) {
            return null;
        }

        return asset('storage/' . $this->photo);
    }

    /**
     * Scope for animals that are still checked in (no time_out)
     */
    public function scopeCheckedIn($query)
    {
        return $query->whereNull('time_out');
    }

    /**
     * Scope for animals that are checked out
     */
    public function scopeCheckedOut($query)
    {
        return $query->whereNotNull('time_out');
    }
}
