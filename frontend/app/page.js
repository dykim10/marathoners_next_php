"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { checkSession } from "@/utils/session";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const [raceList, setRaceList] = useState([]); // ✅ 대회 데이터 저장

    useEffect(() => {
        const verifySession = async () => {
            try {
                const sessionData = await checkSession();
                setIsLoggedIn(sessionData.success);
                setUser(sessionData.user);

            } catch (error) {
                console.error("세션 확인 중 오류 발생:", error);
            }
        };
        verifySession();
        //fetchRaceList();
    }, []);

    const fetchRaceList = async () => {
        try {
            const res = await fetch("/api/race/list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page: 1, rows: 5 }) // 최신 5개만 불러오기
            });

            if (!res.ok) throw new Error("Failed to fetch race list");

            const data = await res.json();
            setRaceList(data.raceList || []); // 데이터 저장
        } catch (error) {
            console.error("Error fetching races:", error);
        }
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    return (
        <Container className="container-lg mt-5 text-center">
            {/* ✅ 헤딩 섹션 */}
            <h1 className="fw-bold">Welcome to Team PAC</h1>
            <p className="text-muted">팀팩 러너스 환영 공간</p>
            <hr/>

            {/* ✅ 대회 일정 스와이프 섹션 */}
            <Container className="mb-5">
                {raceList.length > 0 ? (
                    <Slider {...sliderSettings}>
                        {raceList.map((race, index) => (
                            <Card key={index} className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{race.mrName}</Card.Title>
                                    <Card.Text>
                                        <strong>일정:</strong> {new Date(race.mrStartDt).toLocaleDateString()}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>장소:</strong> {race.mrLocation}
                                    </Card.Text>
                                    <Button variant="primary" size="sm"
                                            onClick={() => router.push(`/race/view/${race.mrUuid}`)}>
                                        상세보기
                                    </Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Slider>
                ) : (
                    <p>대회 정보를 불러오는 중...</p>
                )}
            </Container>

            {/* ✅ 기능 버튼 섹션 */}
            <Container>
                <Row className="justify-content-center">
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>🏅 대회 일정</Card.Title>
                                <Card.Text>다가오는 마라톤 대회를 확인하세요.</Card.Text>
                                <Button variant="primary" onClick={() => handleNavigation("/race/list")}>더 보기</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>📝 대회 리뷰</Card.Title>
                                <Card.Text>참가자들의 솔직한 리뷰를 읽어보세요.</Card.Text>
                                <Button variant="success" onClick={() => handleNavigation("/review/list")}>더 보기</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>📌 기타 메뉴</Card.Title>
                                <Card.Text>마라톤 관련 다양한 정보를 제공합니다.</Card.Text>
                                <Button variant="warning" onClick={() => handleNavigation("/feature3")}>더 보기</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}
