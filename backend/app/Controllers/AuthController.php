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
     */
    public function verifyToken()
    {
        try {

            log_message('debug', '🔹 요청 수신: verifyToken() 실행됨');

            // ✅ 전체 쿠키 로그 확인
            log_message('debug', '🔹 $_SERVER[HTTP_COOKIE]: ' . ($_SERVER['HTTP_COOKIE'] ?? '없음'));
            log_message('debug', '🔹 $_COOKIE 데이터: ' . json_encode($_COOKIE));

            // ✅ Authorization 헤더에서 JWT 가져오기 (API 테스트용)
            $authHeader = $this->request->getHeaderLine('Authorization');
            if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
                $token = str_replace('Bearer ', '', $authHeader);
                log_message('debug', '🔹 Authorization 헤더에서 JWT 추출: ' . $token);
            } else {
                // ✅ HTTP-Only Secure 쿠키에서 JWT 가져오기 (브라우저 요청용)
                $token = $_COOKIE['token'] ?? null;
                log_message('debug', '🔹 HTTP-Only Secure 쿠키에서 JWT 추출: ' . ($token ? '있음' : '없음'));
            }

            if (!$token) {
                return $this->failUnauthorized('토큰이 없습니다.');
            }

            $result = $this->authService->validateToken($token);
            return $this->respond($result, $result['success'] ? 200 : 401);
        } catch (Exception $e) {

            log_message('error', '❌ JWT 검증 오류: ' . $e->getMessage());
            return $this->failServerError('토큰 검증 중 오류가 발생했습니다.');
        }
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
