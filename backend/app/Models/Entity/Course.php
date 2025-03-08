<?php

namespace App\Models\Entity;

use CodeIgniter\Entity\Entity;
use App\Constants\RaceTypes;

class Course extends Entity
{
    protected $attributes = [
        'seq' => null,
        'mr_uuid' => null,
        'mr_course_version' => null,
        'mr_course_type' => null,
        'mr_course_numeric' => null,
        'mr_course_price' => null,
        'mr_course_recode' => null,
        'mr_course_reg_dt' => null,
    ];

    protected $casts = [
        'seq' => 'string',
        'mr_uuid' => 'string',
        'mr_course_version' => 'string',
        'mr_course_type' => 'string',
        'mr_course_numeric' => 'string',
        'mr_course_price' => 'string',
        'mr_course_recode' => 'string',
        'mr_course_reg_dt' => 'datetime'
    ];

    /**
     * 코스 타입 레이블 반환
     */
    public function getCourseTypeLabel(): string
    {
        return RaceTypes::getLabel($this->mr_course_type);
    }

    /**
     * 코스 가격을 숫자로 반환
     */
    public function getPriceAsNumber(): int
    {
        return (int) $this->mr_course_price;
    }

    /**
     * 모집인원을 숫자로 반환
     */
    public function getNumericAsNumber(): int
    {
        return (int) $this->mr_course_numeric;
    }
} 