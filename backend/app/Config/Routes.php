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
