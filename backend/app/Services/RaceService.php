<?php
namespace App\Services;

use App\Models\RaceModel;
use App\Models\Dto\RaceDto;
use App\Models\Entity\Race;
use CodeIgniter\Database\Exceptions\DatabaseException;
use InvalidArgumentException;

class RaceService
{
    protected $raceModel;

    public function __construct()
    {
        $this->raceModel = new RaceModel();
    }

    /**
     * 모든 마라톤 대회 목록 조회
     * 
     * @param array $params 필터링 및 정렬 매개변수
     * @return array
     */
    public function getAllRaces(array $params = []): array
    {
        // DTO를 통해 필터 파라미터 변환
        $filters = RaceDto::forFilter($params);
        
        // 모델을 통해 데이터 조회
        $result = $this->raceModel->getRaces($filters);
        
        // echo json_encode($result);
        // exit;

        // DTO를 통해 응답 데이터 변환
        return RaceDto::forListResponse($result['data'], $result['pager']);
    }

    /**
     * 특정 마라톤 대회 조회
     * 
     * @param int $id 대회 ID
     * @return array
     * @throws InvalidArgumentException
     */
    public function getRaceById(int $id): array
    {
        $race = $this->raceModel->find($id);
        
        if (!$race) {
            throw new InvalidArgumentException('해당 마라톤 대회를 찾을 수 없습니다.');
        }
        
        // Entity를 배열로 변환
        return RaceDto::forResponse($race->toArray());
    }

    /**
     * 새로운 마라톤 대회 생성
     * 
     * @param array $raceData 대회 데이터
     * @return array
     * @throws InvalidArgumentException
     */
    public function createRace(array $raceData): array
    {
        try {
            // DTO를 통해 생성 데이터 변환
            $createData = RaceDto::forCreate($raceData);
            
            // 유효성 검사 및 데이터 저장
            if (!$this->raceModel->insert($createData)) {
                $errors = $this->raceModel->errors();
                throw new InvalidArgumentException(implode(', ', $errors));
            }
            
            // 생성된 대회 정보 반환
            return $this->getRaceById($this->raceModel->getInsertID());
        } catch (DatabaseException $e) {
            throw new InvalidArgumentException('대회 생성 중 오류가 발생했습니다: ' . $e->getMessage());
        }
    }

    /**
     * 마라톤 대회 정보 업데이트
     * 
     * @param int $id 대회 ID
     * @param array $raceData 업데이트할 대회 데이터
     * @return array
     * @throws InvalidArgumentException
     */
    public function updateRace(int $id, array $raceData): array
    {
        // 대회 존재 여부 확인
        $this->getRaceById($id);
        
        try {
            // DTO를 통해 업데이트 데이터 변환
            $updateData = RaceDto::forUpdate($raceData);
            
            // 데이터가 비어있는지 확인
            if (empty($updateData)) {
                throw new InvalidArgumentException('업데이트할 데이터가 없습니다.');
            }
            
            // 유효성 검사 및 데이터 업데이트
            if (!$this->raceModel->update($id, $updateData)) {
                $errors = $this->raceModel->errors();
                throw new InvalidArgumentException(implode(', ', $errors));
            }
            
            // 업데이트된 대회 정보 반환
            return $this->getRaceById($id);
        } catch (DatabaseException $e) {
            throw new InvalidArgumentException('대회 업데이트 중 오류가 발생했습니다: ' . $e->getMessage());
        }
    }

    /**
     * 마라톤 대회 삭제 (소프트 삭제)
     * 
     * @param int $id 대회 ID
     * @return bool
     * @throws InvalidArgumentException
     */
    public function deleteRace(int $id): bool
    {
        // 대회 존재 여부 확인
        $this->getRaceById($id);
        
        $updateData = [
            'mr_use_yn' => 'N',
            'mr_mod_dt' => date('Y-m-d H:i:s')
        ];
        
        if (!$this->raceModel->update($id, $updateData)) {
            throw new InvalidArgumentException('대회 삭제 처리 중 오류가 발생했습니다.');
        }
        
        return true;
    }
    
    /**
     * 대회 상태 변경
     * 
     * @param int $id 대회 ID
     * @param string $status 변경할 상태
     * @return array
     * @throws InvalidArgumentException
     */
    public function changeRaceStatus(int $id, string $status): array
    {
        // 상태 유효성 검사
        if (!in_array($status, Race::getStatusList())) {
            throw new InvalidArgumentException('유효하지 않은 대회 상태입니다.');
        }
        
        return $this->updateRace($id, ['status' => $status]);
    }
}