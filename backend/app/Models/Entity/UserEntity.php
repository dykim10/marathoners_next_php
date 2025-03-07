<?php

namespace App\Models\Entity;

use CodeIgniter\Entity\Entity;

class UserEntity extends Entity
{
    //db 컬럼명을 그대로 기입
    protected $attributes = [
        'user_uuid'     => null,
        'user_id' => null,
        'user_name'    => null,
        'user_email'    => null,
        'user_password' => null,
        'user_reg_dt' => null,
    ];

    // 비밀번호 해싱 (setter 메서드 활용) -- 회원가입 시에 .. 또는 비밀번호 변경시 활용해요.
    public function setPassword(string $password)
    {
        $this->attributes['user_password'] = password_hash($password, PASSWORD_BCRYPT);
        return $this;
    }
}
