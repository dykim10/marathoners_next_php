<?php

namespace App\Models\Entity;

use CodeIgniter\Entity\Entity;

class Race extends Entity
{
    protected $attributes = [
        'mr_uuid' => null,
        'mr_name' => null,
        'mr_start_dt' => null,
        'mr_location' => null,
        'mr_content' => null,
        'mr_company' => null,
        'mr_reg_adm' => null,
        'mr_reg_dt' => null,
        'mr_mod_dt' => null,
        'mr_final_status' => null,
        'mr_use_yn' => null,
        'mr_etc_memo' => null,
        'mr_homepage_url' => null,
        'courses' => null, // Course 엔티티 배열을 저장할 속성
    ];

    protected $casts = [
        'mr_uuid' => 'string',
        'mr_name' => 'string',
        'mr_start_dt' => 'datetime',
        'mr_location' => 'string',
        'mr_content' => 'string',
        'mr_company' => 'string',
        'mr_reg_adm' => 'string',
        'mr_final_status' => 'string',
        'mr_use_yn' => 'string',
        'mr_homepage_url' => 'string',
        'courses' => 'array'
    ];

    /**
     * 대회 상태 상수
     */
    const STATUS_ACTIVE = 'Y';
    const STATUS_INACTIVE = 'N';

    /**
     * 대회 종료 상태 상수
     */
    const FINAL_STATUS_COMPLETED = 'Y';
    const FINAL_STATUS_NOT_COMPLETED = 'N';

    /**
     * 대회가 활성 상태인지 확인
     */
    public function isActive(): bool
    {
        return $this->mr_use_yn === self::STATUS_ACTIVE;
    }

    /**
     * 대회가 종료되었는지 확인
     */
    public function isCompleted(): bool
    {
        return $this->mr_final_status === self::FINAL_STATUS_COMPLETED;
    }

    /**
     * 코스 목록 설정
     */
    public function setCourses(array $courses): self
    {
        $this->attributes['courses'] = $courses;
        return $this;
    }

    /**
     * 코스 목록 반환
     */
    public function getCourses(): array
    {
        return $this->attributes['courses'] ?? [];
    }
} 