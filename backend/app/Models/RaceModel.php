<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\Entity\Race;

class RaceModel extends Model
{
    protected $table = 'tb_marathon_race';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = Race::class;
    protected $useSoftDeletes = true;
    
    protected $allowedFields = [
        'race_name', 
        'race_date', 
        'location', 
        'distance', 
        'max_participants', 
        'registration_fee', 
        'description', 
        'status'
    ];
    
    // 날짜 필드
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';
    
    // 유효성 검사 규칙
    protected $validationRules = [
        'race_name' => 'required|min_length[3]|max_length[255]',
        'race_date' => 'required|valid_date',
        'location' => 'required|max_length[255]',
        'distance' => 'required|numeric',
        'max_participants' => 'required|integer',
        'registration_fee' => 'required|numeric',
        'status' => 'required|in_list[active,inactive,completed,cancelled]'
    ];
    
    protected $validationMessages = [
        'race_name' => [
            'required' => '대회 이름은 필수입니다.',
            'min_length' => '대회 이름은 최소 3자 이상이어야 합니다.',
        ],
        'race_date' => [
            'required' => '대회 날짜는 필수입니다.',
            'valid_date' => '유효한 날짜 형식이 아닙니다.',
        ],
    ];
    
    protected $skipValidation = false;

    /**
     * 대회 목록 조회 (필터링 및 페이지네이션 적용)
     * 
     * @param array $filters 필터링 조건
     * @return array
     */
    public function getRaces(array $filters = []): array
    {
        $builder = $this->builder();
        
        // 검색 필터 적용
        if (!empty($filters['search'])) {
            $builder->groupStart()
                    ->like('race_name', $filters['search'])
                    ->orLike('location', $filters['search'])
                    ->groupEnd();
        }
        
        // 상태 필터 적용
        if (!empty($filters['status'])) {
            $builder->where('status', $filters['status']);
        }
        
        // 날짜 필터 적용
        if (!empty($filters['date_from'])) {
            $builder->where('race_date >=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $builder->where('race_date <=', $filters['date_to']);
        }
        
        // 정렬 적용
        $sortField = $filters['sort_by'] ?? 'race_date';
        $sortOrder = $filters['sort_order'] ?? 'ASC';
        $builder->orderBy($sortField, $sortOrder);
        
        // 페이지네이션
        $page = $filters['page'] ?? 1;
        $limit = $filters['limit'] ?? 10;
        
        return [
            'data' => $this->paginate($limit, 'default', $page),
            'pager' => $this->pager->getDetails()
        ];
    }
}
