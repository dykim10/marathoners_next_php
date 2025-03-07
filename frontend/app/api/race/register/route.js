import { NextResponse } from "next/server";

// ✅ API 엔드포인트 (POST 요청)
export async function POST(req) {
    try {
        const requestData = await req.json(); // 프론트에서 보낸 데이터 받기

        // 백엔드 API 엔드포인트 설정
         const API_URL = process.env.NEXT_PUBLIC_API_URL; // Spring Boot 서버 주소

        // 백엔드로 데이터 전달
        const response = await fetch(`${API_URL}/api/marathon/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        // 응답 처리
        if (!response.ok) {
            throw new Error(`백엔드 요청 실패: ${response.statusText}`);
        }

        const responseData = await response.json(); // 백엔드 응답 받기
        return NextResponse.json(responseData, { status: 200 }); // 프론트엔드에 응답 반환
    } catch (error) {
        console.error("API 요청 오류:", error);
        return NextResponse.json({ message: "대회 등록 오류 발생" }, { status: 500 });
    }
}
