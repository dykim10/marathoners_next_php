'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRaces } from '../../lib/hooks/useRaces';
import RaceStatusBadge from './RaceStatusBadge';

export default function RaceDetail({ id }) {
  const router = useRouter();
  const { loading, error, getRaceById, deleteRace, changeRaceStatus } = useRaces();
  const [race, setRace] = useState(null);

  // 대회 정보 조회
  const fetchRace = async () => {
    try {
      const response = await getRaceById(id);
      setRace(response.data);
    } catch (err) {
      console.error('대회 정보 조회 오류:', err);
    }
  };

  // 대회 삭제 핸들러
  const handleDelete = async () => {
    if (window.confirm('정말로 이 대회를 삭제하시겠습니까?')) {
      try {
        await deleteRace(id);
        router.push('/races'); // 목록 페이지로 이동
      } catch (err) {
        console.error('대회 삭제 오류:', err);
      }
    }
  };

  // 대회 상태 변경 핸들러
  const handleStatusChange = async (status) => {
    try {
      const response = await changeRaceStatus(id, status);
      setRace(response.data);
    } catch (err) {
      console.error('대회 상태 변경 오류:', err);
    }
  };

  // 컴포넌트 마운트 시 대회 정보 조회
  useEffect(() => {
    fetchRace();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!race) {
    return <div className="text-center py-8">대회 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{race.race_name}</h1>
        <div className="flex space-x-2">
          <Link href="/races" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            목록으로
          </Link>
          <Link href={`/races/${id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">대회 정보</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">상태:</span>{' '}
                <RaceStatusBadge status={race.status} />
              </div>
              <div>
                <span className="font-medium text-gray-600">날짜:</span>{' '}
                {new Date(race.race_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium text-gray-600">위치:</span> {race.location}
              </div>
              <div>
                <span className="font-medium text-gray-600">거리:</span> {race.distance} km
              </div>
              <div>
                <span className="font-medium text-gray-600">최대 참가자:</span> {race.max_participants}명
              </div>
              <div>
                <span className="font-medium text-gray-600">참가비:</span> {race.registration_fee}원
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">대회 설명</h2>
            <p className="text-gray-700 whitespace-pre-line">{race.description}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">대회 상태 관리</h2>
          <div className="flex flex-wrap gap-2">
            {race.status !== 'active' && (
              <button
                onClick={() => handleStatusChange('active')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                활성화
              </button>
            )}
            {race.status !== 'inactive' && (
              <button
                onClick={() => handleStatusChange('inactive')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                비활성화
              </button>
            )}
            {race.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                완료
              </button>
            )}
            {race.status !== 'cancelled' && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                취소
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 