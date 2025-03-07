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
        try {
            // 요청 데이터 검증
            if (empty($requestData['loginId']) || empty($requestData['loginPassword'])) {
                return ['success' => false, 'message' => '아이디와 비밀번호를 입력하세요.'];
            }

            //log_message('debug',"api로 받은 => " . $requestData['loginId'] . " => " . $requestData['loginPassword']);

            // 사용자 정보 조회
            $user = $this->userModel->findByUserId($requestData['loginId']);
            if (!$user || !password_verify($requestData['loginPassword'], $user->user_password)) {
                return ['success' => false, 'message' => '잘못된 로그인 정보입니다.'];
            }

            // JWT 생성
            $token = $this->generateJWT([
                'userId' => $user->user_id,
                'userName' => $user->user_name
            ]);

            // HTTP-Only Secure 쿠키 설정
            setcookie("token", $token, [
                'expires' => time() + 3600,
                'path' => '/',
                'secure' => false,  // ✅ HTTPS 환경에서는 true로 변경해야 함
                'httponly' => true,  // ✅ JavaScript 접근 차단 (XSS 방지)
                'samesite' => 'Lax' // ✅ PHP가 쿠키를 감지하지 못하면 'None'으로 변경 후 테스트
            ]);

            return [
                'success' => true,
                'user' => new UserDTO($user->toArray()),
                'token' => $token
            ];
        } catch (Exception $e) {
            //log_message('error', '로그인 처리 중 오류: ' . $e->getMessage());
            return ['success' => false, 'message' => '서버 오류가 발생했습니다.'];
        }
    }

    /**
     * JWT 토큰 검증 처리
     */
    public function validateToken(string $authHeader): array
    {
        try {
            if (!$authHeader) {
                return ['success' => false, 'message' => '토큰이 제공되지 않았습니다.'];
            }

            $token = str_replace('Bearer ', '', $authHeader);
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
