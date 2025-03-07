"use client";

import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { CheckCircleFill, ClockFill, PencilFill } from "react-bootstrap-icons";


export default function IntroducePage() {
    return (
        <Container className="py-5">
            <h1 className="text-center mb-4">사이트 소개</h1>

            <Row className="mb-4">
                <Col md={{ span: 8, offset: 2 }}>
                    <Card className="shadow-sm p-3">
                        <Card.Body>
                            <Card.Title className="fw-bold">사이트 개발 기술</Card.Title>
                            <Card.Text>
                                이 사이트는 최신 웹 기술을 활용하여 개발되었습니다.
                            </Card.Text>
                                <div>
                                    <ul>
                                        <li>Frontend: Next.js 15.1.7 (App Router 방식) / react 19.0.0</li>
                                        <li>Backend: Spring Boot 3.4</li>
                                        <li>Database: PostgreSQL</li>
                                        <li>ORM: MyBatis + Lombok</li>
                                        <li>UI Framework: React-Bootstrap</li>
                                        <li>Programming Language: Java 17, JavaScript</li>
                                    </ul>
                                </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            {/* ✅ 사이트 개발 목표 제목 */}
                            <Card.Title className="fw-bold fs-4 text-primary">🚀 사이트 개발 목표</Card.Title>
                            <hr />

                            {/* ✅ 목표 개요 */}
                            <Card.Text className="text-muted">
                                이 사이트는 <span className="fw-semibold">마라톤 대회 정보 제공</span> 및
                                <span className="text-decoration-underline"> 참가자 리뷰 빅데이터화</span>를 목표로 합니다.
                                사용자는 보다 객관적인 데이터를 통해 참가할 대회를 선택할 수 있습니다.
                            </Card.Text>

                            {/* ✅ 개발 진행 현황 */}
                            <Card className="mt-3 border-0">
                                <Card.Body>
                                    <Card.Title className="fw-bold fs-5 text-success">📌 개발 진행 단계</Card.Title>
                                    <ListGroup variant="flush" className="mt-2">
                                        <ListGroup.Item>
                                            <CheckCircleFill className="text-success me-2" />
                                            회원가입 및 로그인 기능 개발 완료 ✅
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <ClockFill className="text-warning me-2" />
                                            마라톤 일정 및 기록 관리 시스템 개발 진행 중 ⏳
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <PencilFill className="text-secondary me-2" />
                                            마라톤 대회 리뷰 시스템 구축 예정 ✏️
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <PencilFill className="text-secondary me-2" />
                                            참가자 커뮤니티 기능 구축 예정 ✏️
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
