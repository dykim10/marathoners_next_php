export const checkSession = async () => {
    try {
        console.log("🔹 checkSession() 실행 시작...");

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // ✅ 브라우저에서 쿠키 값 가져오기
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        console.log("🔹 API_URL:", API_URL);

        const response = await fetch(`/api/auth/verify`, {
            method: "GET",
            credentials: "include", // ✅ HTTP-Only Secure 쿠키 포함 요청
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Cookie": `token=${token}` } : {}), // ✅ 쿠키가 있으면 명시적으로 전달
            },
        });

        console.log("`/api/auth/verify` 응답 상태:", response.status);

        if (response.status === 401) {
            console.log("로그인되지 않은 상태 - JWT 없음 또는 만료됨");
            return { success: false, user: null }; // 로그인되지 않은 상태
        }

        if (!response.ok) {
            throw new Error("JWT 검증 실패");
        }

        const data = await response.json();
        console.log("JWT 유효함, 사용자 정보:", data.user);

        return { success: true, user: data.user }; // 로그인 상태 유지
    } catch (error) {
        console.error("JWT 검증 중 오류 발생:", error);
        console.error("❌ `checkSession` 실행 중 오류 발생:", error.message);

        return { success: false, user: null }; // 오류 발생 시
    }
};


