export async function POST(req) {
    try {
        const { loginId, loginPassword } = await req.json();

        const API_URL = process.env.NEXT_PUBLIC_API_URL; // BackEnd 서버 URL
        console.log("🔹 API_URL:", process.env.NEXT_PUBLIC_API_URL);

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",  // 세션 유지
            body: JSON.stringify({ loginId, loginPassword }),
        });

        console.log("BackEnd 응답 상태 코드:", response.status);
        if (!response.ok) {
            const errorText = await response.text();
            console.log("BackEnd 응답 내용:", errorText);
            return Response.json({ error: "로그인 실패", detail: errorText }, { status: response.status });
        }

        // BackEnd 받은 `Set-Cookie` 헤더 처리
        const setCookie = response.headers.get("Set-Cookie"); // 다중 쿠키 지원이 안 될 수도 있음
        console.log("BackEnd 에서 받은 Set-Cookie:", setCookie);

        // BackEnd 반환된 데이터를 JSON으로 변환
        const data = await response.json();
        console.log("back data = >  ", data);

        // 응답 헤더 생성
        const headers = new Headers({
            "Content-Type": "application/json",
        });

        if (setCookie) {
            headers.append("Set-Cookie", setCookie); // 쿠키가 있을 경우 추가
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: headers,
        });

    } catch (error) {
        console.error("Next.js API Route 내부 오류:", error);
        return Response.json({ error: "서버 오류 발생" }, { status: 500 });
    }
}
