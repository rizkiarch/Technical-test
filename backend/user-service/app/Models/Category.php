<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'type';
    protected $table = 'categories';

    public function animals()
    {
        return $this->hasMany(Animal::class, 'category', 'type');
    }
}
