<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Services\AuthService;
use Exception;

class AuthController extends ResourceController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * 로그인 API
     */
    public function login()
    {
        try {
            $request = $this->request->getJSON(true); // 요청 데이터 배열 변환
            $result = $this->authService->loginUser($request); // 서비스로 요청을 그대로 전달 (비즈니스 로직 제거)

            return $this->respond($result, $result['success'] ? 200 : 401);

        } catch (Exception $e) {
            //log_message('error', 'Login Error: ' . $e->getMessage());
            return $this->failServerError('로그인 처리 중 오류가 발생했습니다.');
        }
    }

    /**
     * JWT 토큰 검증 API
     * 
     * @return Response
     */
    public function verifyToken()
    {
        try {
            // JWT 토큰 검증 로직
            $token = $this->getTokenFromRequest();
            
            if (!$token) {
                // 토큰이 없는 경우 401 대신 200 상태 코드와 함께 인증되지 않음을 반환
                return $this->response->withJson([
                    'success' => true,
                    'isAuthenticated' => false,
                    'user' => null,
                    'message' => '로그인이 필요합니다.'
                ], 200);
            }
            
            // 토큰 검증 로직
            $userData = $this->authService->validateToken($token);
            
            if (!$userData) {
                // 토큰이 유효하지 않은 경우도 200 상태 코드와 함께 인증되지 않음을 반환
                return $this->response->withJson([
                    'success' => true,
                    'isAuthenticated' => false,
                    'user' => null,
                    'message' => '세션이 만료되었습니다. 다시 로그인해주세요.'
                ], 200);
            }
            
            // 토큰이 유효한 경우
            return $this->response->withJson([
                'success' => true,
                'isAuthenticated' => true,
                'user' => $userData
            ], 200);
        } catch (\Exception $e) {
            // 실제 오류가 발생한 경우에만 오류 응답
            return $this->response->withJson([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 요청에서 토큰 추출
     * 
     * @return string|null
     */
    private function getTokenFromRequest()
    {
        // 쿠키에서 토큰 추출
        $token = isset($_COOKIE['token']) ? $_COOKIE['token'] : null;
        
        // 헤더에서 토큰 추출 (쿠키에 없는 경우)
        if (!$token && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
            if (strpos($authHeader, 'Bearer ') === 0) {
                $token = substr($authHeader, 7);
            }
        }
        
        return $token;
    }

    public function logout()
    {
        log_message('info', '🔹 로그아웃 요청 수신');

        // ✅ 요청에서 쿠키 값 가져오기
        $token = $_COOKIE['token'] ?? null;

        if (!$token) {
            return $this->response
                ->setStatusCode(401)
                ->setJSON(['error' => 'No token provided']);
        }

        // ✅ 서버에서 쿠키 만료 처리 (토큰 제거)
        setcookie("token", "", time() - 3600, "/", "", true, true);

        return $this->response
            ->setStatusCode(200)
            ->setJSON(['success' => true, 'message' => '로그아웃 성공']);
    }

}
