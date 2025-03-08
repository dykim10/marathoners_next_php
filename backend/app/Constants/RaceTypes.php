<?php

namespace App\Constants;

class RaceTypes
{
    const WALK_COURSE = 'WALK_COURSE';
    const FIVE_COURSE = 'FIVE_COURSE';
    const TEN_COURSE = 'TEN_COURSE';
    const HALF_COURSE = 'HALF_COURSE';
    const FULL_COURSE = 'FULL_COURSE';
    const FIFTY_COURSE = 'FIFTY_COURSE';
    const HUNDRED_COURSE = 'HUNDRED_COURSE';
    const ETC_COURSE = 'ETC_COURSE';

    public static function getLabel(string $key): string
    {
        return self::LABELS[$key] ?? '';
    }

    public static function getTypes(): array
    {
        return [
            self::WALK_COURSE,
            self::FIVE_COURSE,
            self::TEN_COURSE,
            self::HALF_COURSE,
            self::FULL_COURSE,
            self::FIFTY_COURSE,
            self::HUNDRED_COURSE,
            self::ETC_COURSE
        ];
    }

    const LABELS = [
        self::WALK_COURSE => '걷기',
        self::FIVE_COURSE => '5K',
        self::TEN_COURSE => '10K',
        self::HALF_COURSE => 'Half',
        self::FULL_COURSE => '풀코스',
        self::FIFTY_COURSE => '50K',
        self::HUNDRED_COURSE => '100K',
        self::ETC_COURSE => '기타'
    ];
} 