<?php

namespace Database\Seeders;

use App\Models\Animal;
use App\Models\Category;
use Illuminate\Database\Seeder;

class AnimalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (Category::count() === 0) {
            $this->command->error('Categories not found! Please run CategorySeeder first.');
            return;
        }

        Animal::truncate();

        $animals = [
            [
                'id' => '250919/Anjing/001',
                'name_animal' => 'Buddy',
                'name_owner' => 'John Doe',
                'type_animal' => 'Anjing',
                'email_owner' => 'john.doe@example.com',
                'phone_owner' => '+6281234567890',
                'weight' => '15',
                'photo' => '',
                'time_registered' => '2025-09-19 08:00:00',
                'time_out' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '250919/Kucing/001',
                'name_animal' => 'Whiskers',
                'name_owner' => 'Jane Smith',
                'type_animal' => 'Kucing',
                'email_owner' => 'jane.smith@example.com',
                'phone_owner' => '+6281234567891',
                'weight' => '4',
                'photo' => '',
                'time_registered' => '2025-09-19 09:30:00',
                'time_out' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '250919/Anjing/002',
                'name_animal' => 'Max',
                'name_owner' => 'Bob Wilson',
                'type_animal' => 'Anjing',
                'email_owner' => 'bob.wilson@example.com',
                'phone_owner' => '+6281234567892',
                'weight' => '20',
                'photo' => '',
                'time_registered' => '2025-09-19 10:15:00',
                'time_out' => '2025-09-19 16:30:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '250919/Kucing/002',
                'name_animal' => 'Luna',
                'name_owner' => 'Alice Brown',
                'type_animal' => 'Kucing',
                'email_owner' => 'alice.brown@example.com',
                'phone_owner' => '+6281234567893',
                'weight' => '3.5',
                'photo' => '',
                'time_registered' => '2025-09-19 11:00:00',
                'time_out' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '250919/Kelinci/001',
                'name_animal' => 'Fluffy',
                'name_owner' => 'Charlie Davis',
                'type_animal' => 'Kelinci',
                'email_owner' => 'charlie.davis@example.com',
                'phone_owner' => '+6281234567894',
                'weight' => '2',
                'photo' => '',
                'time_registered' => '2025-09-19 12:00:00',
                'time_out' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert data animals ke database
        Animal::insert($animals);

        $this->command->info('Animals seeded successfully!');
        $this->command->info('Created ' . count($animals) . ' animals:');

        foreach ($animals as $animal) {
            $status = $animal['time_out'] ? 'Checked Out' : 'Checked In';
            $this->command->line("- {$animal['name_animal']} ({$animal['type_animal']}) - {$status}");
        }
    }
}
