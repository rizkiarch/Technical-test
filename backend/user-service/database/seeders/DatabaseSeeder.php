<?php

namespace Database\Seeders;

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
        // Seed users
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed categories (WAJIB untuk aplikasi berfungsi)
        $this->call([
            CategorySeeder::class,
            AnimalSeeder::class, // Data dummy untuk testing
        ]);

        $this->command->info('Database seeding completed successfully!');
    }
}
