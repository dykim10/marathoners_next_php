<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;
use App\Models\Dto\UserDTO;
use Exception;

class AuthService
{
    private UserModel $userModel;
    private string $secretKey;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->secretKey = getenv('JWT_SECRET') ?: (config('App')->jwtSecret ?? 'default_secret_key');
    }

    /**
     * 사용자 로그인 처리
     */
    public function loginUser(array $requestData): array
    {
        // ✅ 요청 데이터 검증을 서비스에서 수행
        if (empty($requestData['login_id']) || empty($requestData['login_pwd'])) {
            return ['success' => false, 'message' => '아이디와 비밀번호를 입력하세요.'];
        }

        // ✅ DB에서 사용자 조회
        $user = $this->userModel->findByUserId($requestData['login_id']);
        if (!$user || !password_verify($requestData['login_pwd'], $user->user_password)) {
            return ['success' => false, 'message' => '잘못된 로그인 정보입니다.'];
        }

        // ✅ JWT 생성
        $token = $this->generateJWT(['userId' => $user->user_id, 'userName' => $user->user_name]);

        return [
            'success' => true,
            'user' => new UserDTO($user->toArray()),
            'token' => $token
        ];
    }

    /**
     * JWT 토큰 검증 처리
     */
    public function validateToken(string $authHeader): array
    {
        if (!$authHeader) {
            return ['success' => false, 'message' => '토큰이 제공되지 않았습니다.'];
        }

        $token = str_replace('Bearer ', '', $authHeader);
        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return ['success' => true, 'message' => '토큰이 유효합니다.', 'user' => $decoded->data];
        } catch (Exception $e) {
            return ['success' => false, 'message' => '유효하지 않은 토큰입니다.'];
        }
    }

    /**
     * JWT 생성 메서드
     */
    private function generateJWT(array $userData): string
    {
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // 1시간 만료
            'data' => $userData
        ];

        return JWT::encode($payload, $this->secretKey, 'HS256');
    }
}
