'use client';

export const checkSession = async () => {
    try {
        console.log("🔹 checkSession() 실행 시작...");

        // ✅ 브라우저에서 쿠키 값 가져오기
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        const response = await fetch(`/api/auth/verify`, {
            method: "GET",
            credentials: "include", // ✅ HTTP-Only Secure 쿠키 포함 요청
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Cookie": `token=${token}` } : {}), // ✅ 쿠키가 있으면 명시적으로 전달
            },
        });

        // 응답 상태 코드 로깅
        console.log("`/api/auth/verify` 응답 상태:", response.status);

        // 응답이 성공적이지 않은 경우 (500 등의 서버 오류)
        if (!response.ok) {
            console.error("서버 오류 발생:", response.status);
            return { success: false, isAuthenticated: false, user: null };
        }

        // 응답 데이터 파싱
        const data = await response.json();
        
        // 인증 상태에 따른 처리
        if (data.isAuthenticated) {
            console.log("JWT 유효함, 사용자 정보:", data.user);
            return { success: true, isAuthenticated: true, user: data.user };
        } else {
            console.log("로그인되지 않은 상태 또는 세션 만료:", data.message);
            return { success: true, isAuthenticated: false, user: null, message: data.message };
        }
    } catch (error) {
        console.error("JWT 검증 중 오류 발생:", error);
        return { success: false, isAuthenticated: false, user: null, error: error.message };
    }
};


