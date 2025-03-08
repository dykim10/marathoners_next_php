<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

//test
$routes->get('/system-info', 'SystemInfo::phpInfo');

/**
 * Auth
 * user login , jwt, logout
 */
$routes->post('api/auth/login', 'AuthController::login');
$routes->get('api/auth/verify', 'AuthController::verifyToken');
$routes->post('/api/auth/logout', 'AuthController::logout');

// 마라톤 대회 API 라우트
$routes->group('api', ['namespace' => 'App\Controllers'], function($routes) {
    $routes->resource('races', ['controller' => 'RaceController']);
    $routes->put('races/(:num)/status', 'RaceController::changeStatus/$1');
});
