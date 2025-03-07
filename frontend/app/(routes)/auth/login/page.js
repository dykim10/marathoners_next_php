"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { checkSession } from "@/utils/session"; //

export default function LoginPage() {
    const router = useRouter();
    const [loginId, setLoginId] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [error, setError] = useState("");

    //로그인 이후 데이터 셋
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // ✅ 로그인 상태 확인 (JWT가 쿠키에 존재하는지 검증)
    useEffect(() => {
        const verifySession = async () => {
            const sessionData = await checkSession();
            if (sessionData.success) {
                router.push("/");
            }
        };
        //세션체크하는 공통 모듈 연결
        verifySession();
    }, []);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",     // 쿠키를 자동으로 포함
                body: JSON.stringify({ loginId, loginPassword }),
            });

            if (!response.ok) {
                throw new Error("로그인 실패. 아이디와 비밀번호를 확인하세요.");
            }

            window.location.href = "/";     // 새로고침하여 인증 상태 반영
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4 shadow-sm" style={{ width: "350px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">로그인</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="loginID">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="아이디 입력"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호 입력"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* ✅ 버튼을 가로로 정렬 */}
                        <div className="d-flex justify-content-between">
                            <Button variant="primary" type="submit" className="w-50 me-2">
                                로그인
                            </Button>

                            <Button
                                variant="secondary"
                                type="button"
                                className="w-50"
                                onClick={() => router.push("/user/register")}
                            >
                                회원가입
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
