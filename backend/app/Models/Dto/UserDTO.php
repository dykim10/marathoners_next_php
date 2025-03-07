<?php

namespace App\Models\Dto;

class UserDTO
{
    public string $userUuid;
    public string $userName;
    public string $userId;
    public string $userEmail;
    public string $userLastLoginDt;

    public function __construct(array $data)
    {
        $this->userUuid = $data['user_uuid'] ?? '';
        $this->userId = $data['user_id'] ?? '';
        $this->userName = $data['user_name'] ?? '';
        $this->userEmail = $data['user_email'] ?? '';
        $this->userLastLoginDt = $data['user_last_login_dt'] ?? '';
    }

    public function toArray(): array
    {
        return [
            'userUuid'          => $this->userUuid,
            'userId'            => $this->userId,
            'userName'          => $this->userName,
            'userEmail'         => $this->userEmail,
            'userLastLoginDt'   => $this->userLastLoginDt
        ];
    }
}
