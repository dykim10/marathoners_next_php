<?php

namespace App\Models\Dto;

class RaceDto
{
    /**
     * 대회 생성 DTO
     */
    public static function forCreate(array $data): array
    {
        return [
            'mr_name' => $data['mr_name'] ?? null,
            'mr_start_dt' => $data['mr_start_dt'] ?? null,
            'location' => $data['location'] ?? null,
            'distance' => $data['distance'] ?? null,
            'max_participants' => $data['max_participants'] ?? null,
            'registration_fee' => $data['registration_fee'] ?? null,
            'description' => $data['description'] ?? null,
            'mr_use_yn' => $data['mr_use_yn'] ?? 'active',
        ];
    }

    /**
     * 대회 업데이트 DTO
     */
    public static function forUpdate(array $data): array
    {
        $updateData = [];
        
        $allowedFields = [
            'mr_name', 'mr_start_dt', 'location', 'distance', 
            'max_participants', 'registration_fee', 'description', 'status'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }
        
        return $updateData;
    }

    /**
     * 대회 목록 필터링 DTO
     */
    public static function forFilter(array $params): array
    {
        return [
            'search' => $params['search'] ?? null,
            'status' => $params['status'] ?? null,
            'date_from' => $params['date_from'] ?? null,
            'date_to' => $params['date_to'] ?? null,
            'sort_by' => $params['sort_by'] ?? 'mr_start_dt',
            'sort_order' => $params['sort_order'] ?? 'ASC',
            'page' => (int)($params['page'] ?? 1),
            'limit' => (int)($params['limit'] ?? 10),
        ];
    }

    /**
     * 대회 응답 DTO
     */
    public static function forResponse(array $race): array
    {
        return [
            'id' => $race['id'],
            'mr_name' => $race['mr_name'],
            'mr_start_dt' => $race['mr_start_dt'],
            'mr_location' => $race['mr_location'],
            'distance' => $race['distance'],
            'max_participants' => $race['max_participants'],
            'registration_fee' => $race['registration_fee'],
            'description' => $race['description'],
            'status' => $race['status'],
            'created_at' => $race['created_at'],
            'updated_at' => $race['updated_at'],
        ];
    }

    /**
     * 대회 목록 응답 DTO
     */
    public static function forListResponse(array $races, array $pagination): array
    {
        $racesList = [];
        
        foreach ($races as $race) {
            $racesList[] = self::forResponse($race);
        }
        
        return [
            'races' => $racesList,
            'pagination' => [
                'current_page' => $pagination['current_page'],
                'total_pages' => $pagination['total_pages'],
                'total_items' => $pagination['total_items'],
                'per_page' => $pagination['per_page'],
            ]
        ];
    }
} 