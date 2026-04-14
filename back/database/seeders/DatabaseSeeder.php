<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Compte admin
        User::firstOrCreate(
            ['email' => 'admin@leguichet.fr'],
            [
                'name'     => 'Admin',
                'password' => Hash::make('password'),
                'role'     => 'admin',
            ]
        );

        // Compte utilisateur de test
        User::firstOrCreate(
            ['email' => 'user@leguichet.fr'],
            [
                'name'     => 'Utilisateur Test',
                'password' => Hash::make('password'),
                'role'     => 'user',
            ]
        );
    }
}
