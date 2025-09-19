<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::truncate();

        $categories = [
            [
                'type' => 'Anjing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Kucing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Kelinci',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Reptil',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'Lainnya',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert data kategori ke database
        Category::insert($categories);

        $this->command->info('Categories seeded successfully!');
        $this->command->info('Created ' . count($categories) . ' categories:');

        foreach ($categories as $category) {
            $this->command->line("- {$category['type']}");
        }
    }
}
