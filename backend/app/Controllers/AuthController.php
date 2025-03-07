<?php

namespace App\Controllers;

use App\Services\AuthService;
use CodeIgniter\Controller;
use CodeIgniter\HTTP\ResponseInterface;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * 로그인 페이지 표시
     */
    public function login(): string
    {
        return view('auth/login');
    }

    /**
     * 로그인 처리
     * @ Routes.php 에서 여기를 바라보고 있다.
     */
    public function processLogin()
    {
        try {
            // View에서 POST로 받은 값 저장 (userId, userPassword)
            $userId = $this->request->getPost('userId');
            $userPwd = $this->request->getPost('userPassword');

            log_message("debug", "로그인 시도 - userId: {$userId}, userPwd : {$userPwd}");

            // AuthService를 통해 로그인 검증
            $result = $this->authService->loginUser($userId, $userPwd);
            log_message("debug", json_encode($result));
            if ($result['success']) {
                log_message('info', "로그인 성공 - userId: {$userId}");

                // 세션 저장
                session()->set([
                    'userUuid'     => $result['user']->userUuid,
                    'userId'   => $result['user']->userId, // userId로 저장
                    'userName'   => $result['user']->userName, // userId로 저장
                    'userEmail'    => $result['user']->userEmail,
                    'userLastLoginDt'    => $result['user']->userLastLoginDt,
                    'isLoggedIn' => true
                ]);

                return redirect()->to('/dashboard');
            } else {
                log_message('warning', "로그인 실패 - userId: {$userId}, 이유: {$result['message']}");
                return redirect()->back()->with('error', $result['message']);
            }
        } catch (\Exception $e) {
            log_message('error', 'Login Error: ' . $e->getMessage());
            return redirect()->back()->with('error', '로그인 중 오류가 발생했습니다.');
        }
    }

    /**
     * 로그아웃 처리
     */
    public function logout(): ResponseInterface
    {
        session()->destroy();
        return redirect()->to('/login');
    }
}

