// 인증이 필요하지 않은 공개 API
$app->group('/api', function ($app) {
    // 로그인/회원가입
    $app->post('/auth/login', AuthController::class . ':login');
    $app->post('/auth/register', AuthController::class . ':register');
    
    // 인증 상태 확인 (항상 200 응답)
    $app->get('/auth/verify', AuthController::class . ':verifyToken');
    
    // 공개 데이터 API
    $app->get('/public-data', PublicController::class . ':getPublicData');
});

// 인증이 필요한 보호된 API
$app->group('/api', function ($app) {
    // 사용자 정보
    $app->get('/user/profile', UserController::class . ':getProfile');
    $app->put('/user/profile', UserController::class . ':updateProfile');
    
    // 대회 관리
    $app->get('/races', RaceController::class . ':getRaces');
    $app->get('/races/{id}', RaceController::class . ':getRace');
    $app->post('/races', RaceController::class . ':createRace');
    $app->put('/races/{id}', RaceController::class . ':updateRace');
    $app->delete('/races/{id}', RaceController::class . ':deleteRace');
    
    // 로그아웃
    $app->post('/auth/logout', AuthController::class . ':logout');
})->add(new AuthMiddleware($container->get('jwtService'))); 