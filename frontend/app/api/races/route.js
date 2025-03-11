import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * 마라톤 대회 목록 조회 API
 */
export async function GET(request) {
  try {
    console.log('1. Next.js API Route: GET /api/races 요청 받음');
    
    // URL 검색 파라미터 추출
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    console.log('2. 요청 파라미터:', params);
    
    // axios 설정
    const axiosConfig = {
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 // 5초 타임아웃
    };
    
    // 백엔드 API 호출
    const targetUrl = `${API_URL}/races`;
    console.log('3. 백엔드 API 호출 URL:', targetUrl);
    console.log('4. axios 설정:', axiosConfig);
    
    const response = await axios.get(targetUrl, axiosConfig);
    console.log('5. 백엔드 응답:', response.data);
    
    return NextResponse.json(response.data);

  } catch (error) {
    console.error('API 에러 발생');
    console.error('에러 메시지:', error.message);
    console.error('에러 설정:', {
      baseURL: API_URL,
      method: 'GET',
      url: '/races',
      params: Object.fromEntries(new URL(request.url).searchParams)
    });
    
    if (error.response) {
      // 서버가 2xx 범위를 벗어난 상태 코드로 응답한 경우
      console.error('백엔드 응답 상태:', error.response.status);
      console.error('백엔드 응답 데이터:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('응답을 받지 못함:', error.request);
    }
    
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
    const response = await axios.post(`${API_URL}/races`, raceData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
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