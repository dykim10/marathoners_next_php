<?php

namespace App\Services;

use App\Models\UserModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

class UserService
{
    protected $userModel;

    public function __construct(UserModel $userModel)
    {
        $this->userModel = $userModel;
    }

    /**
     * 사용자 회원가입 처리
     * 
     * @param array $userData
     * @return UserModel
     * @throws InvalidArgumentException
     */
    public function register(array $userData)
    {
        // 데이터 유효성 검사
        $validator = Validator::make($userData, [
            'email' => 'required|valid_email|is_unique[tb_users.user_email]',    //CI4 tb_users 테이블의 user_email
            'password' => 'required|min:8',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        // 비밀번호 해싱
        $userData['password'] = Hash::make($userData['password']);

        // 사용자 생성
        return $this->userModel->create([
            'email' => $userData['email'],
            'password' => $userData['password'],
            'name' => $userData['name'],
        ]);
    }
}
