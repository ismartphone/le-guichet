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
        Schema::create('tribunes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->integer('capacite');
            $table->decimal('prix', 8, 2);
            $table->foreignId('stade_id')->constrained('stades')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tribunes');
    }
};
