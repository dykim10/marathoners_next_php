import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * 마라톤 대회 목록 조회 API
 */
export async function GET(request) {
  try {
    // URL 검색 파라미터 추출
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // 백엔드 API 호출
    const response = await axios.get(`${API_URL}/races`, { params });
    
    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 새 마라톤 대회 생성 API
 */
export async function POST(request) {
  try {
    // 요청 본문 추출
    const raceData = await request.json();
    
    // 백엔드 API 호출
    const response = await axios.post(`${API_URL}/races`, raceData);
    
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * API 에러 처리 함수
 */
function handleApiError(error) {
  if (error.response) {
    // 서버에서 응답이 왔지만 에러 상태 코드인 경우
    const status = error.response.status || 500;
    const message = error.response.data.message || '서버 오류가 발생했습니다.';
    
    return NextResponse.json({ error: message }, { status });
  } else if (error.request) {
    // 요청이 전송되었지만 응답이 없는 경우
    return NextResponse.json(
      { error: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.' }, 
      { status: 503 }
    );
  } else {
    // 요청 설정 중 에러가 발생한 경우
    return NextResponse.json(
      { error: '요청 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 