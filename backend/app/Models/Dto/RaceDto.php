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
            'race_name' => $data['race_name'] ?? null,
            'race_date' => $data['race_date'] ?? null,
            'location' => $data['location'] ?? null,
            'distance' => $data['distance'] ?? null,
            'max_participants' => $data['max_participants'] ?? null,
            'registration_fee' => $data['registration_fee'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'active',
        ];
    }

    /**
     * 대회 업데이트 DTO
     */
    public static function forUpdate(array $data): array
    {
        $updateData = [];
        
        $allowedFields = [
            'race_name', 'race_date', 'location', 'distance', 
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
            'sort_by' => $params['sort_by'] ?? 'race_date',
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
            'race_name' => $race['race_name'],
            'race_date' => $race['race_date'],
            'location' => $race['location'],
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