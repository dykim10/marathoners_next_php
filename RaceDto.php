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