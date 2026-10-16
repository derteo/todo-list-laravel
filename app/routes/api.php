<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ChecklistController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\Api\AuthController;

// Rotte pubbliche
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Rotte protette
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('checklists', ChecklistController::class);
    Route::apiResource('notes',      NoteController::class);
});

// Controllo di stato: 200 solo se il database è raggiungibile
Route::get('/health', function () {
    try {
        \Illuminate\Support\Facades\DB::select('select 1');
        return response()->json(['status' => 'ok']);
    } catch (\Throwable $e) {
        return response()->json(['status' => 'error'], 503);
    }
});
