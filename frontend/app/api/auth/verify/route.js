export async function GET(req) {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL; // CI4 백엔드 URL

        // ✅ 요청에서 쿠키 가져오기
        const cookies = req.headers.get("cookie") || "";
        console.log("🔹 Next.js에서 받은 쿠키:", cookies);

        const response = await fetch(`${API_URL}/api/auth/verify`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies, // ✅ 서버에서 받은 쿠키를 그대로 전달
            },
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.ok ? 200 : 401 });
    } catch (error) {
        console.error(" Next.js JWT 검증 중 오류 발생:", error);
        return new Response(JSON.stringify({ error: "서버 오류 발생" }), { status: 500 });
    }
}
