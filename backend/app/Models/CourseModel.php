<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\Entity\Course;
use App\Constants\RaceTypes;

class CourseModel extends Model
{
    protected $table = 'tb_marathon_course';
    protected $primaryKey = 'seq';
    protected $useAutoIncrement = true;
    protected $returnType = Course::class;
    protected $useSoftDeletes = false;
    
    protected $allowedFields = [
        'mr_uuid',
        'mr_course_version',
        'mr_course_type',
        'mr_course_numeric',
        'mr_course_price',
        'mr_course_recode'
    ];
    
    // 날짜 필드
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'mr_course_reg_dt';
    
    // 유효성 검사 규칙
    protected $validationRules = [
        'mr_uuid' => 'required|max_length[100]',
        'mr_course_type' => 'required|in_list[' . self::COURSE_TYPE_LIST . ']',
        'mr_course_numeric' => 'required|numeric',
        'mr_course_price' => 'required|numeric',
    ];
    
    protected $validationMessages = [
        'mr_uuid' => [
            'required' => '대회 UUID는 필수입니다.',
        ],
        'mr_course_type' => [
            'required' => '코스 종류는 필수입니다.',
            'in_list' => '유효하지 않은 코스 종류입니다.',
        ],
    ];
    
    protected $skipValidation = false;

    private const COURSE_TYPE_LIST = 'WALK_COURSE,FIVE_COURSE,TEN_COURSE,HALF_COURSE,FULL_COURSE,FIFTY_COURSE,HUNDRED_COURSE,ETC_COURSE';

    /**
     * 대회별 코스 목록 조회
     */
    public function getCoursesByRaceId(string $raceId): array
    {
        return $this->where('mr_uuid', $raceId)
                   ->orderBy('mr_course_type', 'ASC')
                   ->findAll();
    }

    /**
     * 코스 정보 생성 전 처리
     */
    protected function beforeInsert(array $data): array
    {
        $data['data']['mr_course_version'] = $data['data']['mr_course_version'] ?? '1';
        return $data;
    }
} 