/**
 * user/route.js
 * 회원 관련 API를 한 곳에서 통합 관리하도록 리팩토링
 * POST → 회원가입 (/api/user/register)
 * PUT → 회원정보 수정 (/api/user/update)
 * DELETE → 회원탈퇴 (/api/user/delete)
 * GET → 로그인한 사용자 정보 (/api/user/me) 또는 특정 사용자 정보 (/api/user/info?userId=123)
 */

export async function POST(request) {
    try {
        const formData = await request.json();
        const API_URL = process.env.NEXT_PUBLIC_API_URL; // Spring Boot 서버 주소

        //백엔드 UserController (`/api/register`)로 요청 전달
        const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error("회원가입 오류:", error);
        return new Response(JSON.stringify({ error: "회원가입 중 서버 오류 발생" }), { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const formData = await request.json();
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        //백엔드 UserController (`/api/update`)로 요청 전달
        const response = await fetch(`${API_URL}/api/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error("회원정보 수정 오류:", error);
        return new Response(JSON.stringify({ error: "회원정보 수정 중 서버 오류 발생" }), { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const formData = await request.json();
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const cookieHeader = request.headers.get("cookie"); // 현재 쿠키 가져오기

        //백엔드 UserController (`/api/delete`)로 요청 전달
        const response = await fetch(`${API_URL}/api/delete`, {
            method: "DELETE",
            headers: {
                Cookie: cookieHeader || "", // 백엔드로 쿠키 전달
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        return new Response(JSON.stringify({ error: "회원 탈퇴 중 서버 오류 발생" }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const userId = searchParams.get("userId");  //searchParams에 userId를 넣으면 타인, 안넣으면 본인.
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const cookieHeader = request.headers.get("cookie");
        let apiEndpoint = `${API_URL}/api/me`; // 기본적으로 로그인한 사용자 정보 조회

        if (userId) {
            apiEndpoint = `${API_URL}/api/info?userId=${userId}`; // 특정 사용자 정보 조회
        }

        //백엔드 UserController로 요청 전달
        const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader || "",
            },
            credentials: "include",  // 인증 정보를 포함 (세션/쿠키 유지)
        });

        if (!response.ok) {
            throw new Error(`서버 응답 오류! 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error("회원정보 조회 오류:", error);
        return new Response(JSON.stringify({ error: "회원정보 조회 중 서버 오류 발생" }), { status: 500 });
    }

}
