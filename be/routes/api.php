<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route for login
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,5');

// Route for register
Route::post('/register', [AuthController::class, 'register']);

