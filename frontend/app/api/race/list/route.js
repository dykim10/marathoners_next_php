export async function POST(request) {
    try {
        const { keyword, year, month, page, rows } = await request.json();
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        // Offset 계산 (페이징 처리)
        const offset = (page - 1) * rows;

        // Spring Boot API 호출
        const response = await fetch(`${API_URL}/api/marathon/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                keyword,
                year,
                month,
                offset,
                rows
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch data from Race Data");
        }

        const data = await response.json();
        console.log(data);
        // 받은 데이터를 그대로 프론트엔드에 반환
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Failed to fetch Race Data : ", error);
        return new Response(JSON.stringify({ error: "Failed to fetch Race Data" }), { status: 500 });
    }
}
