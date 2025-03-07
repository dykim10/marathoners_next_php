export async function GET(request) {
    try {
        const cookieHeader = request.headers.get("cookie");
        console.log("세션 확인 요청 - 현재 쿠키:", cookieHeader);
        console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`, {
            method: "GET",
            credentials: "include",
            headers: {
                Cookie: cookieHeader || "",
            },
        });

        console.log("백엔드 `/api/session` 응답 상태:", response.status);

        // 🔹 백엔드에서 401을 받으면 그대로 401을 반환
        if (response.status === 401) {
            console.log("✅ 로그인되지 않은 상태 - 세션 없음 (Next.js)");
            return new Response(JSON.stringify({ error: "로그인되지 않은 상태" }), { status: 401 });
        }

        if (!response.ok) {
            console.log("백엔드 `/api/session` 요청 실패 - 상태 코드:", response.status);
            return new Response(JSON.stringify({ error: "세션 없음" }), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("Next.js API Route 내부 오류:", error);
        return new Response(JSON.stringify({ error: "서버 오류 발생" }), { status: 500 });
    }
}
