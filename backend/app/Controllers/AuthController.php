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

            // ✅ 서비스로 요청을 그대로 전달 (비즈니스 로직 제거)
            $result = $this->authService->loginUser($request);

            return $this->respond($result, $result['success'] ? 200 : 401);
        } catch (Exception $e) {
            log_message('error', 'Login Error: ' . $e->getMessage());
            return $this->failServerError('로그인 처리 중 오류가 발생했습니다.');
        }
    }

    /**
     * JWT 토큰 검증 API
     */
    public function verifyToken()
    {
        try {
            $authHeader = $this->request->getHeaderLine('Authorization');

            // ✅ 토큰 검증을 서비스에서 수행
            $result = $this->authService->validateToken($authHeader);

            return $this->respond($result, $result['success'] ? 200 : 401);
        } catch (Exception $e) {
            log_message('error', 'Token Verification Error: ' . $e->getMessage());
            return $this->failServerError('토큰 검증 중 오류가 발생했습니다.');
        }
    }
}
