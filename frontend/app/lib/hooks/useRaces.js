'use client';

import { useState } from 'react';

/**
 * 마라톤 대회 API를 사용하기 위한 커스텀 훅
 */
export function useRaces() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 마라톤 대회 목록 조회
   */
  const getRaces = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // URL 검색 파라미터 생성
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      
      // API 호출
      const response = await fetch(`/api/races?${searchParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '마라톤 대회 목록을 불러오는데 실패했습니다.');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 특정 마라톤 대회 조회
   */
  const getRaceById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await fetch(`/api/races/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '마라톤 대회 정보를 불러오는데 실패했습니다.');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 새로운 마라톤 대회 생성
   */
  const createRace = async (raceData) => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await fetch('/api/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(raceData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '마라톤 대회 생성에 실패했습니다.');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 마라톤 대회 정보 업데이트
   */
  const updateRace = async (id, raceData) => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await fetch(`/api/races/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(raceData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '마라톤 대회 업데이트에 실패했습니다.');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 마라톤 대회 삭제
   */
  const deleteRace = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await fetch(`/api/races/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '마라톤 대회 삭제에 실패했습니다.');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 마라톤 대회 상태 변경
   */
  const changeRaceStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const response = await fetch(`/api/races/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '마라톤 대회 상태 변경에 실패했습니다.');
      }
      
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getRaces,
    getRaceById,
    createRace,
    updateRace,
    deleteRace,
    changeRaceStatus,
  };
} 