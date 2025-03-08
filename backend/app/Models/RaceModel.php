<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\Entity\Race;

class RaceModel extends Model
{
    protected $table = 'tb_marathon_race';
    protected $primaryKey = 'mr_uuid';
    protected $useAutoIncrement = false;
    protected $returnType = Race::class;
    protected $useSoftDeletes = false;
    
    protected $allowedFields = [
        'mr_uuid',
        'mr_name',
        'mr_start_date',
        'mr_location',
        'mr_content',
        'mr_company',
        'mr_reg_adm',
        'mr_final_status',
        'mr_use_yn',
        'mr_etc_memo',
        'mr_homepage_url'
    ];
    
    // 날짜 필드
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'mr_reg_dt';
    protected $updatedField = 'mr_mod_dt';
    
    // 유효성 검사 규칙
    protected $validationRules = [
        'mr_name' => 'required|min_length[3]|max_length[100]',
        'mr_start_date' => 'required|valid_date',
        'mr_location' => 'required|max_length[100]',
        'mr_use_yn' => 'required|in_list[Y,N]'
    ];
    
    protected $validationMessages = [
        'mr_name' => [
            'required' => '대회 이름은 필수입니다.',
            'min_length' => '대회 이름은 최소 3자 이상이어야 합니다.',
        ],
        'mr_start_date' => [
            'required' => '대회 날짜는 필수입니다.',
            'valid_date' => '유효한 날짜 형식이 아닙니다.',
        ],
    ];
    
    protected $skipValidation = false;

    /**
     * 대회 목록 조회 (필터링 및 페이지네이션 적용)
     */
    public function getRaces(array $filters = []): array
    {
        $builder = $this->builder();
        
        // 기본적으로 사용 중인 레코드만 조회
        $builder->where('mr_use_yn', 'Y');
        
        // 검색 필터 적용
        if (!empty($filters['search'])) {
            $builder->groupStart()
                    ->like('mr_name', $filters['search'])
                    ->orLike('mr_location', $filters['search'])
                    ->groupEnd();
        }
        
        // 상태 필터 적용
        if (!empty($filters['mr_final_status'])) {
            $builder->where('mr_final_status', $filters['mr_final_status']);
        }
        
        // 날짜 필터 적용
        if (!empty($filters['date_from'])) {
            $builder->where('mr_start_date >=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $builder->where('mr_start_date <=', $filters['date_to']);
        }
        
        // 정렬 적용
        $sortField = $filters['sort_by'] ?? 'mr_start_date';
        $sortOrder = $filters['sort_order'] ?? 'ASC';
        $builder->orderBy($sortField, $sortOrder);
        
        // 페이지네이션
        $page = $filters['page'] ?? 1;
        $limit = $filters['limit'] ?? 10;
        
        $result = [
            'data' => $this->paginate($limit, 'default', $page),
            'pager' => $this->pager->getDetails()
        ];

        // 각 대회의 코스 정보 로드
        $courseModel = new CourseModel();
        foreach ($result['data'] as $race) {
            $courses = $courseModel->getCoursesByRaceId($race->mr_uuid);
            $race->setCourses($courses);
        }

        return $result;
    }

    /**
     * 단일 대회 조회 시 코스 정보도 함께 로드
     */
    public function find($id = null)
    {
        $race = parent::find($id);
        if ($race) {
            $courseModel = new CourseModel();
            $courses = $courseModel->getCoursesByRaceId($race->mr_uuid);
            $race->setCourses($courses);
        }
        return $race;
    }

    /**
     * UUID 생성
     */
    protected function generateUuid(): string
    {
        return uniqid('race_', true);
    }

    /**
     * 데이터 삽입 전 처리
     */
    protected function beforeInsert(array $data): array
    {
        $data['data']['mr_uuid'] = $this->generateUuid();
        $data['data']['mr_use_yn'] = $data['data']['mr_use_yn'] ?? 'Y';
        $data['data']['mr_final_status'] = $data['data']['mr_final_status'] ?? 'N';
        return $data;
    }
}
