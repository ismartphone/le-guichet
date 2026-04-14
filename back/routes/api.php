<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\TribuneController;
use App\Http\Controllers\ReservationController;

// Auth (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Auth (connecté)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Public
Route::get('/clubs', [ClubController::class, 'index']);
Route::get('/matchs', [MatchController::class, 'index']);
Route::get('/matchs/{id}', [MatchController::class, 'show']);
Route::get('/tribunes/{match_id}', [TribuneController::class, 'index']);

// Réservations (connecté)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
});

// Admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/clubs', [ClubController::class, 'store']);
    Route::put('/clubs/{id}', [ClubController::class, 'update']);
    Route::delete('/clubs/{id}', [ClubController::class, 'destroy']);

    Route::post('/matchs', [MatchController::class, 'store']);
    Route::put('/matchs/{id}', [MatchController::class, 'update']);
    Route::delete('/matchs/{id}', [MatchController::class, 'destroy']);
    Route::post('/matchs/sync', [MatchController::class, 'sync']);

    Route::post('/tribunes', [TribuneController::class, 'store']);
    Route::put('/tribunes/{id}', [TribuneController::class, 'update']);
    Route::delete('/tribunes/{id}', [TribuneController::class, 'destroy']);
});
