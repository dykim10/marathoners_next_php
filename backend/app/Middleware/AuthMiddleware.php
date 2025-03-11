/**
 * 인증 미들웨어
 */
public function __invoke($request, $response, $next)
{
    try {
        $token = $this->getTokenFromRequest($request);
        
        if (!$token) {
            return $response->withJson([
                'success' => false,
                'message' => '인증이 필요합니다.'
            ], 401);
        }
        
        $userData = $this->jwtService->verifyToken($token);
        
        if (!$userData) {
            return $response->withJson([
                'success' => false,
                'message' => '유효하지 않은 토큰입니다.'
            ], 401);
        }
        
        // 사용자 정보를 요청 객체에 추가
        $request = $request->withAttribute('user', $userData);
        
        // 다음 미들웨어 또는 라우트 핸들러로 진행
        return $next($request, $response);
    } catch (\Exception $e) {
        return $response->withJson([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

/**
 * 요청에서 토큰 추출
 * 
 * @param Request $request
 * @return string|null
 */
private function getTokenFromRequest($request)
{
    // 쿠키에서 토큰 추출
    $cookies = $request->getCookieParams();
    $token = isset($cookies['token']) ? $cookies['token'] : null;
    
    // 헤더에서 토큰 추출 (쿠키에 없는 경우)
    if (!$token) {
        $authHeader = $request->getHeaderLine('Authorization');
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
        }
    }
    
    return $token;
} 