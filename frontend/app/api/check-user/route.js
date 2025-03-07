export async function POST(req) {
    try {
        // 클라이언트에서 받은 데이터 파싱
        const { type, value } = await req.json();
        const API_URL = process.env.NEXT_PUBLIC_API_URL; // Spring Boot 서버 URL

        // 백엔드 API 요청 API_URL 연결할 때는 ` 백틱 문자 활용하기.
        const response = await fetch(`${API_URL}/api/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, value }),
        });

        if (!response.ok) {
            throw new Error("서버 응답 오류!?");
        }

        // 백엔드 응답 데이터 파싱
        const data = await response.json();

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("중복 확인 API 오류:", error);
        return new Response(JSON.stringify({ error: "서버 오류 발생!" }), { status: 500 });
    }
}
