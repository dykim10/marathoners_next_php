<?php

namespace App\Models\Dto;

use App\Models\Entity\Race;
use App\Models\Entity\Course;

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
            'mr_location' => $data['location'] ?? null,
            'distance' => $data['distance'] ?? null,
            'max_participants' => $data['max_participants'] ?? null,
            'registration_fee' => $data['registration_fee'] ?? null,
            'description' => $data['description'] ?? null,
            'mr_use_yn' => $data['mr_use_yn'] ?? 'active',
        ];
    }

    /**
     * 대회 생성 DTO - options 5km, 10km 등
     */
    public static function forCreateOpts(array $data): array
    {
        return [
            'mr_name' => $data['mr_name'] ?? null,
            'mr_start_dt' => $data['mr_start_dt'] ?? null,
            'mr_location' => $data['location'] ?? null,
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
     * 대회 정보를 응답 형식으로 변환
     * 
     * @param Race $race 대회 엔티티
     * @return array 응답용 대회 데이터
     */
    public static function forResponse(Race $race): array
    {
        // 대회 기본 정보
        $response = [
            'uuid' => $race->getMrUuid(),
            'name' => $race->getMrName(),
            'startDate' => $race->getMrStartDt(),
            'location' => $race->getMrLocation(),
            'content' => $race->getMrContent(),
            'company' => $race->getMrCompany(),
            'finalStatus' => $race->getMrFinalStatus(),
            'useYn' => $race->getMrUseYn(),
            'etcMemo' => $race->getMrEtcMemo(),
            'homepageUrl' => $race->getMrHomepageUrl(),
            'regDate' => $race->getMrRegDt(),
            'modDate' => $race->getMrModDt(),
        ];

        // 코스 정보 추가
        $courses = [];
        if ($race->getCourses()) {
            foreach ($race->getCourses() as $course) {
                $courses[] = self::formatCourse($course);
            }
        }
        
        $response['courses'] = $courses;
        
        return $response;
    }

    /**
     * 대회 목록을 응답 형식으로 변환
     * 
     * @param array $races 대회 엔티티 배열
     * @param int|null $totalCount 전체 대회 수
     * @param int $page 현재 페이지
     * @param int $rows 페이지당 행 수
     * @return array 응답용 대회 목록 데이터
     */
    public static function forListResponse(array $races, ?int $totalCount = null, int $page = 1, int $rows = 10): array
    {
        $items = [];
        
        foreach ($races as $race) {
            $items[] = self::forResponse($race);
        }
        
        // totalCount가 제공되지 않은 경우 races 배열의 길이 사용
        $count = $totalCount ?? count($races);
        
        return [
            'totalCount' => $count,
            'page' => $page,
            'rows' => $rows,
            'items' => $items
        ];
    }

    /**
     * 코스 정보를 포맷팅
     * 
     * @param Course $course 코스 엔티티
     * @return array 포맷팅된 코스 데이터
     */
    private static function formatCourse(Course $course): array
    {
        return [
            'seq' => $course->getSeq(),
            'courseVersion' => $course->getMrCourseVersion(),
            'courseType' => $course->getMrCourseType(),
            'courseTypeEtcText' => $course->getMrCourseTypeEtcText(),
            'courseCapacity' => $course->getMrCourseCapacity(),
            'coursePrice' => $course->getMrCoursePrice(),
            'courseRegDate' => $course->getMrCourseRegDt(),
            'useYn' => $course->getCourseUseYn()
        ];
    }

    /**
     * 대회 생성/수정을 위한 요청 데이터 검증 및 변환
     * 
     * @param array $requestData 요청 데이터
     * @return array 검증 및 변환된 데이터
     */
    public static function fromRequest(array $requestData): array
    {
        // 대회 기본 정보 검증 및 변환
        $raceData = [
            'mr_name' => $requestData['name'] ?? null,
            'mr_start_dt' => $requestData['startDate'] ?? null,
            'mr_location' => $requestData['location'] ?? null,
            'mr_content' => $requestData['content'] ?? null,
            'mr_company' => $requestData['company'] ?? null,
            'mr_final_status' => $requestData['finalStatus'] ?? 'N',
            'mr_use_yn' => $requestData['useYn'] ?? 'Y',
            'mr_etc_memo' => $requestData['etcMemo'] ?? null,
            'mr_homepage_url' => $requestData['homepageUrl'] ?? null,
            'reg_mod_adm' => $requestData['regModAdm'] ?? null,
        ];

        // 코스 정보 검증 및 변환
        $coursesData = [];
        if (isset($requestData['courses']) && is_array($requestData['courses'])) {
            foreach ($requestData['courses'] as $course) {
                $courseData = [
                    'mr_course_version' => $course['courseVersion'] ?? 1,
                    'mr_course_type' => $course['courseType'] ?? null,
                    'mr_course_type_etc_text' => $course['courseTypeEtcText'] ?? null,
                    'mr_course_capacity' => $course['courseCapacity'] ?? null,
                    'mr_course_price' => $course['coursePrice'] ?? 0.00,
                    'course_use_yn' => $course['useYn'] ?? 'Y',
                ];
                
                // 기존 코스 수정 시 seq 포함
                if (isset($course['seq'])) {
                    $courseData['seq'] = $course['seq'];
                }
                
                $coursesData[] = $courseData;
            }
        }

        return [
            'race' => $raceData,
            'courses' => $coursesData
        ];
    }
} 
