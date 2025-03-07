"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/utils/session";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import Link from "next/link";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const verifySession = async () => {
            const sessionData = await checkSession();
            setIsLoggedIn(sessionData.success);
            setUser(sessionData.user);

        };
        verifySession();
    }, []);

    const handleMyInfo = () => {
        router.push("/user/me");
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
            setIsLoggedIn(sessionData.success);
            window.location.href = "/";
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
            <Container>
                {/* 좌측: 로고 및 메뉴 */}
                <Navbar.Brand as={Link} href="/" className="fw-bold text-light me-3">
                    Marathoners
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* ✅ 대회 일정 */}
                        <Nav.Link href="/race/list">대회 일정</Nav.Link>

                        {/* ✅ 대회 리뷰 */}
                        <Nav.Link href="/review/list">대회 리뷰</Nav.Link>

                        {/* ✅ 주요 대회 (하드코딩된 서브메뉴 포함) */}
                        <NavDropdown title="주요 대회" id="major-races-dropdown">
                            <NavDropdown.Item href="/major/marathon1">🏅 서울 마라톤</NavDropdown.Item>
                            <NavDropdown.Item href="/major/marathon2">🏅 부산 마라톤</NavDropdown.Item>
                            <NavDropdown.Item href="/major/marathon3">🏅 대구 국제 마라톤</NavDropdown.Item>
                            <NavDropdown.Item href="/major/marathon4">🏅 춘천 마라톤</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>

                    {/* 우측: 로그인 상태 관리 */}
                    <Nav className="ms-auto">
                        {isLoggedIn ? (
                            <>
                                <Button className="btn btn-danger btn-sm me-2" variant="danger" onClick={handleLogout}>
                                    로그아웃
                                </Button>
                                <Button className="btn btn-warning btn-sm" variant="warning" onClick={handleMyInfo}>
                                    내 정보
                                </Button>
                            </>
                        ) : (
                            <Nav.Link as={Link} href="/auth/login" className="text-light">
                                로그인
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
