<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('matchs', function (Blueprint $table) {
            $table->unsignedBigInteger('api_football_id')->nullable()->unique()->after('id');
            $table->tinyInteger('score_domicile')->nullable()->after('statut');
            $table->tinyInteger('score_exterieur')->nullable()->after('score_domicile');
        });
    }

    public function down(): void
    {
        Schema::table('matchs', function (Blueprint $table) {
            $table->dropColumn(['api_football_id', 'score_domicile', 'score_exterieur']);
        });
    }
};
