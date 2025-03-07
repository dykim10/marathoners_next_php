"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { checkSession } from "@/utils/session"; //

export default function LoginPage() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            const sessionData = await checkSession();
            if (sessionData.success) {
                setIsLoggedIn(true);
                setUser(sessionData.user);
                router.push("/"); // 로그인된 경우 홈으로 리디렉트
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        verifySession();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ userId, password }),
            });

            if (!response.ok) {
                throw new Error("로그인 실패. 아이디와 비밀번호를 확인하세요.");
            }

            checkSession(); // 로그인 후 세션 체크 실행

            //router.push("/"); //CSR 방식이라, 클라이언트에서 페이지만 바꿔치기라서, 다른 곳 적용이 안되는 모습이 보임.
            window.location.href = "/"; // ✅ 가장 확실한 방법 (완전한 새로고침)

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
                        <Form.Group className="mb-3" controlId="userId">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="아이디 입력"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
