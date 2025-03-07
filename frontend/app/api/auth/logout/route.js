export async function POST(request) {
    try {
        const cookieHeader = request.headers.get("cookie"); // 현재 쿠키 가져오기
        console.log("로그아웃 요청 - 현재 쿠키:", cookieHeader);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                Cookie: cookieHeader || "", // 백엔드로 쿠키 전달
            },
        });

        console.log("백엔드 `/api/logout` 응답 상태:", response.status);

        if (!response.ok) {
            console.log("로그아웃 실패 - 상태 코드:", response.status);
            return new Response(JSON.stringify({ error: "로그아웃 실패" }), { status: response.status });
        }

        // ✅ Next.js에서 `Set-Cookie`를 설정하여 쿠키 삭제 (안전한 방법)
        const headers = new Headers();
        headers.append("Set-Cookie", "token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
        headers.append("Content-Type", "application/json");

        console.log("🟢 Next.js에서 Set-Cookie 설정 완료");

        return new Response(JSON.stringify({ message: "로그아웃 성공" }), {
            status: 200,
            headers: headers,
        });


    } catch (error) {
        console.error("Next.js API Route 내부 오류:", error);
        return new Response(JSON.stringify({ error: "서버 오류 발생" }), { status: 500 });
    }
}
