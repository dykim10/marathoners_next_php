<?php

namespace App\Models\Entity;

use CodeIgniter\Entity\Entity;

class Race extends Entity
{
    protected $attributes = [
        'id' => null,
        'race_name' => null,
        'race_date' => null,
        'location' => null,
        'distance' => null,
        'max_participants' => null,
        'registration_fee' => null,
        'description' => null,
        'status' => null,
        'created_at' => null,
        'updated_at' => null,
        'deleted_at' => null,
    ];

    protected $casts = [
        'id' => 'integer',
        'race_name' => 'string',
        'race_date' => 'datetime',
        'location' => 'string',
        'distance' => 'float',
        'max_participants' => 'integer',
        'registration_fee' => 'float',
        'description' => 'string',
        'status' => 'string',
    ];

    /**
     * 대회 상태 상수
     */
    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * 대회 상태 목록
     * 
     * @return array
     */
    public static function getStatusList(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED
        ];
    }

    /**
     * 대회가 활성 상태인지 확인
     * 
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * 대회가 완료 상태인지 확인
     * 
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * 대회가 취소 상태인지 확인
     * 
     * @return bool
     */
    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }
} 