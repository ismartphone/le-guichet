<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('matchs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_domicile_id')->constrained('clubs')->onDelete('cascade');
            $table->foreignId('club_exterieur_id')->constrained('clubs')->onDelete('cascade');
            $table->foreignId('stade_id')->constrained('stades')->onDelete('cascade');
            $table->dateTime('date_match');
            $table->enum('statut', ['a_venir', 'en_cours', 'termine'])->default('a_venir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matchs');
    }
};
