"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { checkSession } from "../utils/session";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from '../components/AuthProvider';
import api from '../utils/api';

export default function Home() {
    const router = useRouter();
    const { isAuthenticated, user, isLoading, authMessage } = useAuth();
    const [races, setRaces] = useState([]);
    const [error, setError] = useState('');
    const [isLoadingRaces, setIsLoadingRaces] = useState(false);

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    useEffect(() => {
        // 인증 상태가 로드된 후에만 대회 데이터 로드 시도
        if (!isLoading) {
            loadRaces();
        }
    }, [isLoading]);

    const loadRaces = async () => {
        try {
            setIsLoadingRaces(true);
            setError('');
            
            // 인증 여부와 관계없이 API 호출 시도
            const response = await api.get('/races', {
                params: { page: 1, rows: 5 }
            });
            
            setRaces(response.data.items || []);
        } catch (err) {
            console.error('대회 데이터 로드 중 오류 발생:', err);
            
            // 401 오류는 이미 인터셉터에서 처리되므로 여기서는 다른 오류만 처리
            if (!err.response || err.response.status !== 401) {
                setError('대회 데이터를 불러오는 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoadingRaces(false);
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

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <Container className="container-lg mt-5 text-center">
            {/* ✅ 헤딩 섹션 */}
            <h1 className="fw-bold">Welcome to Team PAC</h1>
            <p className="text-muted">팀팩 러너스 환영 공간</p>
            <hr/>

            {/* ✅ 대회 일정 스와이프 섹션 */}
            <Container className="mb-5">
                {isAuthenticated ? (
                    <div>
                        <h2>최근 대회 목록</h2>
                        {isLoadingRaces ? (
                            <p>대회 정보 로딩 중...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : races.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {races.map((race, index) => (
                                    <Card key={index} className="shadow-sm">
                                        <Card.Body>
                                            <Card.Title>{race.name}</Card.Title>
                                            <Card.Text>
                                                <strong>일정:</strong> {new Date(race.startDate).toLocaleDateString()}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>장소:</strong> {race.location}
                                            </Card.Text>
                                            <Button variant="primary" size="sm"
                                                    onClick={() => router.push(`/race/${race.uuid}`)}>
                                                상세보기
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Slider>
                        ) : (
                            <p>등록된 대회가 없습니다.</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <p>{authMessage || '로그인이 필요합니다.'}</p>
                        <Button variant="primary" onClick={() => handleNavigation("/login")}>로그인</Button>
                    </div>
                )}
            </Container>

            {/* ✅ 기능 버튼 섹션 */}
            <Container>
                <Row className="justify-content-center">
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
