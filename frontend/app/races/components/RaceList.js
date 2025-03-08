'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRaces } from '../../lib/hooks/useRaces';
import RaceStatusBadge from './RaceStatusBadge';

export default function RaceList() {
  const { loading, error, getRaces, deleteRace, changeRaceStatus } = useRaces();
  const [races, setRaces] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10
  });

  // 대회 목록 조회
  const fetchRaces = async () => {
    try {
      const response = await getRaces(filters);
      setRaces(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('대회 목록 조회 오류:', err);
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // 필터 변경 시 첫 페이지로 이동
    }));
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    fetchRaces();
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  // 대회 삭제 핸들러
  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 대회를 삭제하시겠습니까?')) {
      try {
        await deleteRace(id);
        fetchRaces(); // 목록 새로고침
      } catch (err) {
        console.error('대회 삭제 오류:', err);
      }
    }
  };

  // 대회 상태 변경 핸들러
  const handleStatusChange = async (id, status) => {
    try {
      await changeRaceStatus(id, status);
      fetchRaces(); // 목록 새로고침
    } catch (err) {
      console.error('대회 상태 변경 오류:', err);
    }
  };

  // 필터 또는 페이지 변경 시 대회 목록 조회
  useEffect(() => {
    fetchRaces();
  }, [filters.page, filters.limit]);

  return (
    <div>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 필터 및 검색 */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="대회명 또는 위치 검색"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="w-48">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            검색
          </button>
          
          <Link href="/races/create" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            새 대회 등록
          </Link>
        </form>
      </div>
      
      {/* 대회 목록 */}
      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : races.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow">
          등록된 대회가 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  대회명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  위치
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  거리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {races.map((race) => (
                <tr key={race.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/races/${race.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                      {race.race_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(race.race_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {race.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {race.distance} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RaceStatusBadge status={race.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/races/${race.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(race.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                      {race.status !== 'active' && (
                        <button
                          onClick={() => handleStatusChange(race.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          활성화
                        </button>
                      )}
                      {race.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(race.id, 'completed')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          완료
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 페이지네이션 */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border ${
                  page === pagination.current_page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
} 