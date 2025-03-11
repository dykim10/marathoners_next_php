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
     * @param int $totalCount 전체 대회 수
     * @param int $page 현재 페이지
     * @param int $rows 페이지당 행 수
     * @return array 응답용 대회 목록 데이터
     */
    public static function forListResponse(array $races, int $totalCount, int $page, int $rows): array
    {
        $items = [];
        
        foreach ($races as $race) {
            $items[] = self::forResponse($race);
        }
        
        return [
            'totalCount' => $totalCount,
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


/**
<?php

class CourseDto {
    private $seq;
    private $mrUuid;
    private $courseVersion;
    private $courseType;
    private $courseTypeEtcText;
    private $courseCapacity;
    private $coursePrice;
    private $courseRegDt;
    private $courseUseYn;

    // Getters and Setters
    public function getSeq() { return $this->seq; }
    public function setSeq($seq) { $this->seq = $seq; }
    
    public function getMrUuid() { return $this->mrUuid; }
    public function setMrUuid($mrUuid) { $this->mrUuid = $mrUuid; }
    
    // ... 나머지 getter/setter 메소드들
}

class RaceDto {
    private $mrUuid;
    private $mrName;
    private $mrStartDt;
    private $mrLocation;
    private $mrContent;
    private $mrCompany;
    private $mrRegAdm;
    private $mrRegDt;
    private $mrModDt;
    private $mrFinalStatus;
    private $mrUseYn;
    private $mrEtcMemo;
    private $mrHomepageUrl;
    private $regModAdm;
    
    // Course 정보를 담을 배열
    private $courses = [];

    // Getters and Setters
    public function getMrUuid() { return $this->mrUuid; }
    public function setMrUuid($mrUuid) { $this->mrUuid = $mrUuid; }
    
    public function getMrName() { return $this->mrName; }
    public function setMrName($mrName) { $this->mrName = $mrName; }
    
    // ... 나머지 getter/setter 메소드들

    // Course 관련 메소드
    public function addCourse(CourseDto $course) {
        $this->courses[] = $course;
    }

    public function getCourses() {
        return $this->courses;
    }

    // 대회 등록을 위한 배열 변환 메소드
    public function toArray() {
        return [
            'mr_uuid' => $this->mrUuid,
            'mr_name' => $this->mrName,
            'mr_start_dt' => $this->mrStartDt,
            'mr_location' => $this->mrLocation,
            'mr_content' => $this->mrContent,
            'mr_company' => $this->mrCompany,
            'mr_reg_adm' => $this->mrRegAdm,
            'mr_final_status' => $this->mrFinalStatus,
            'mr_use_yn' => $this->mrUseYn,
            'mr_etc_memo' => $this->mrEtcMemo,
            'mr_homepage_url' => $this->mrHomepageUrl,
            'reg_mod_adm' => $this->regModAdm
        ];
    }

    // JSON 변환을 위한 메소드
    public function toJson() {
        $data = $this->toArray();
        $data['courses'] = array_map(function($course) {
            return [
                'seq' => $course->getSeq(),
                'mr_uuid' => $course->getMrUuid(),
                'mr_course_version' => $course->getCourseVersion(),
                'mr_course_type' => $course->getCourseType(),
                'mr_course_type_etc_text' => $course->getCourseTypeEtcText(),
                'mr_course_capacity' => $course->getCourseCapacity(),
                'mr_course_price' => $course->getCoursePrice(),
                'mr_course_reg_dt' => $course->getCourseRegDt(),
                'course_use_yn' => $course->getCourseUseYn()
            ];
        }, $this->courses);
        
        return json_encode($data);
    }
}

// 대회 정보 생성
$raceDto = new RaceDto();
$raceDto->setMrUuid($uuid);
$raceDto->setMrName("서울마라톤 2024");
// ... 다른 정보들 설정

// 코스 정보 추가
$courseDto = new CourseDto();
$courseDto->setMrUuid($uuid);
$courseDto->setCourseType("풀코스");
$courseDto->setCoursePrice(50000);
// ... 다른 코스 정보들 설정

$raceDto->addCourse($courseDto);

// JSON 형태로 출력
echo $raceDto->toJson();
 */