<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Category::insert([
            ['type' => 'Anjing', 'description' => 'Hewan peliharaan jenis anjing', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Kucing', 'description' => 'Hewan peliharaan jenis kucing', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Kelinci', 'description' => 'Hewan peliharaan jenis kelinci', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Reptil', 'description' => 'Hewan peliharaan jenis reptil', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Lainnya', 'description' => 'Hewan peliharaan jenis lainnya', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
