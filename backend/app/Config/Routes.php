<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

//test
$routes->get('/system-info', 'SystemInfo::phpInfo');

/**
 * user login , jwt
 */
$routes->post('api/auth/login', 'AuthController::login');
$routes->get('api/auth/verify', 'AuthController::verifyToken');