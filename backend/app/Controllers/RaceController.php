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
use App\Models\Entity\Race;
use InvalidArgumentException;

class RaceController extends ResourceController
{
    private $raceService;
    
    public function __construct()
    {
        $this->raceService = new RaceService();
    }
    
    /**
     * 모든 마라톤 대회 목록 반환
     * 
     * @return \CodeIgniter\HTTP\Response
     */
    public function index()
    {
        try {
            $params = $this->request->getGet();
            $result = $this->raceService->getAllRaces($params);
            
            return $this->respond([
                'status' => 'success',
                'message' => '마라톤 대회 목록을 성공적으로 조회했습니다.',
                'data' => $result['races'],
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            return $this->failServerError('서버 오류: ' . $e->getMessage());
        }
    }
    
    /**
     * 특정 마라톤 대회 정보 반환
     * 
     * @param int $id 대회 ID
     * @return \CodeIgniter\HTTP\Response
     */
    public function show($id = null)
    {
        try {
            if (!is_numeric($id)) {
                throw new InvalidArgumentException('유효하지 않은 대회 ID입니다.');
            }
            
            $race = $this->raceService->getRaceById((int)$id);
            
            return $this->respond([
                'status' => 'success',
                'message' => '마라톤 대회 정보를 성공적으로 조회했습니다.',
                'data' => $race
            ]);
        } catch (InvalidArgumentException $e) {
            return $this->failNotFound($e->getMessage());
        } catch (\Exception $e) {
            return $this->failServerError('서버 오류: ' . $e->getMessage());
        }
    }
    
    /**
     * 새로운 마라톤 대회 생성
     * 
     * @return \CodeIgniter\HTTP\Response
     */
    public function create()
    {
        try {
            // JSON 요청 데이터 가져오기
            $raceData = $this->request->getJSON(true);
            
            if (empty($raceData)) {
                throw new InvalidArgumentException('요청 데이터가 비어 있습니다.');
            }
            
            $race = $this->raceService->createRace($raceData);
            
            return $this->respondCreated([
                'status' => 'success',
                'message' => '마라톤 대회가 성공적으로 생성되었습니다.',
                'data' => $race
            ]);
        } catch (InvalidArgumentException $e) {
            return $this->fail($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->failServerError('서버 오류: ' . $e->getMessage());
        }
    }
    
    /**
     * 마라톤 대회 정보 업데이트
     * 
     * @param int $id 대회 ID
     * @return \CodeIgniter\HTTP\Response
     */
    public function update($id = null)
    {
        try {
            if (!is_numeric($id)) {
                throw new InvalidArgumentException('유효하지 않은 대회 ID입니다.');
            }
            
            // JSON 요청 데이터 가져오기
            $raceData = $this->request->getJSON(true);
            
            if (empty($raceData)) {
                throw new InvalidArgumentException('요청 데이터가 비어 있습니다.');
            }
            
            $race = $this->raceService->updateRace((int)$id, $raceData);
            
            return $this->respond([
                'status' => 'success',
                'message' => '마라톤 대회 정보가 성공적으로 업데이트되었습니다.',
                'data' => $race
            ]);
        } catch (InvalidArgumentException $e) {
            return $this->fail($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->failServerError('서버 오류: ' . $e->getMessage());
        }
    }
    
    /**
     * 마라톤 대회 삭제
     * 
     * @param int $id 대회 ID
     * @return \CodeIgniter\HTTP\Response
     */
    public function delete($id = null)
    {
        try {
            if (!is_numeric($id)) {
                throw new InvalidArgumentException('유효하지 않은 대회 ID입니다.');
            }
            
            $this->raceService->deleteRace((int)$id);
            
            return $this->respondDeleted([
                'status' => 'success',
                'message' => '마라톤 대회가 성공적으로 삭제되었습니다.',
                'id' => $id
            ]);
        } catch (InvalidArgumentException $e) {
            return $this->fail($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->failServerError('서버 오류: ' . $e->getMessage());
        }
    }
    
    /**
     * 마라톤 대회 상태 변경
     * 
     * @param int $id 대회 ID
     * @return \CodeIgniter\HTTP\Response
     */
    public function changeStatus($id = null)
    {
        try {
            if (!is_numeric($id)) {
                throw new InvalidArgumentException('유효하지 않은 대회 ID입니다.');
            }
            
            // JSON 요청 데이터 가져오기
            $requestData = $this->request->getJSON(true);
            
            if (empty($requestData) || !isset($requestData['status'])) {
                throw new InvalidArgumentException('상태 정보가 제공되지 않았습니다.');
            }
            
            $race = $this->raceService->changeRaceStatus((int)$id, $requestData['status']);
            
            return $this->respond([
                'status' => 'success',
                'message' => '마라톤 대회 상태가 성공적으로 변경되었습니다.',
                'data' => $race
            ]);
        } catch (InvalidArgumentException $e) {
            return $this->fail($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->failServerError('서버 오류: ' . $e->getMessage());
        }
    }
}