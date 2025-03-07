<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\Entity\UserEntity;

class UserModel extends Model
{
    protected $table = 'tb_users';
    protected $primaryKey = 'user_uuid';
    protected $returnType = UserEntity::class;

    //INSERT 또는 UPDATE 시 허용할 컬럼(필드)을 지정하는 역할
    //만약 없다면, 아무거나 막 인서트 업데이트 할수도 있으니.
    protected $allowedFields = [
        'user_uuid'
        , 'user_id'
        , 'user_name'
        , 'user_email'
        , 'user_password'
    ];

    public function findByUserId(string $userId): ?UserEntity
    {
        return $this->where('user_id', $userId)->first();
    }

    public function saveUser(UserEntity $user): bool
    {
        return $this->insert($user);
    }
}
