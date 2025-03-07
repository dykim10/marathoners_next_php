<?php

/**
 * CI4의 ResourceController에서 기본으로 제공하는 메서드:
 *
 * HTTP 메서드    URI 예시    기본 제공 메서드    설명
 * GET    /users    index()    모든 사용자 목록 조회
 * GET    /users/1    show($id)    특정 사용자 조회
 * POST    /users    create()    새로운 사용자 생성
 * PUT    /users/1    update($id)    사용자 정보 수정
 * DELETE    /users/1    delete($id)    사용자 삭제
 */

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Services\RaceService;

class RaceController extends ResourceController
{
    private $raceService;

}