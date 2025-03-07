"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, Form, Button, Pagination, Dropdown, InputGroup } from "react-bootstrap";

export default function RaceListPage() {
    const router = useRouter();

    const [races, setRaces] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [year, setYear] = useState(""); // 기본 연도 (현재 연도) ==> 입력 new Date().getFullYear()
    const [month, setMonth] = useState(""); // 월 선택
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 현재 연도를 기준으로 최근 5년 전부터 1년 후까지 선택 가능
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

    // API 호출 함수
    const fetchRaces = async () => {
        try {
            const res = await fetch("/api/race/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({keyword, year, month, page, rows}),
            });

            if (!res.ok) throw new Error("Failed to fetch race list");

            const data = await res.json();
            setRaces(data.raceList || []); // undefined 방지
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching races:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // 페이지 진입 시 자동으로 데이터 가져오기
    useEffect(() => {
        fetchRaces();
    }, [page, rows]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading races.</p>;

    return (
        <div className="container mt-4">
            <h2>대회 일정</h2>

            {/* 검색 그룹 UI */}
            <InputGroup className="mb-3">
                {/* 연도 선택 */}
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                        {year}년
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setYear("")}>전체</Dropdown.Item>
                        {availableYears.map((y) => (
                            <Dropdown.Item key={y} onClick={() => setYear(y)}>
                                {y}년
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                {/* 월 선택 */}
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                        {month ? `${month}월` : "월 선택"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setMonth("")}>전체</Dropdown.Item>
                        {[...Array(12)].map((_, i) => (
                            <Dropdown.Item key={i + 1} onClick={() => setMonth(i + 1)}>
                                {i + 1}월
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                {/* 대회명 검색 입력 */}
                <Form.Control type="text" placeholder="대회명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} size="sm" />

                {/* 검색 버튼 */}
                <Button variant="primary" size="sm" onClick={fetchRaces}> 검색 </Button>
            </InputGroup>

            <Dropdown className="mb-3">
                <Dropdown.Toggle variant="secondary" size="sm">
                    목록 개수: {rows}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {[5, 10, 20, 50].map((num) => (
                        <Dropdown.Item key={num} onClick={() => setRows(num)}>
                            {num}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            {/* 대회 일정 테이블 */}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>대회명</th>
                    <th>시작일</th>
                    <th>장소</th>
                    <th>주최</th>
                    <th>홈페이지</th>
                </tr>
                </thead>
                <tbody>

                {races.length > 0 ? (
                    races.map((race, index) => (
                        <tr
                            key={race.mrUuid}
                            style={{cursor: "pointer"}}
                            onClick={() => router.push(`/race/view/${race.mrUuid}`)}
                        >
                            <td>{(page - 1) * rows + index + 1}</td>
                            <td>{race.mrName}</td>
                            <td>{new Date(race.mrStartDt).toLocaleDateString()}</td>
                            <td>{race.mrLocation}</td>
                            <td>{race.mrCompany}</td>
                            <td>
                                {race.mrHomepageUrl ? (
                                    <a href={race.mrHomepageUrl} target="_blank" rel="noopener noreferrer">
                                        사이트 이동
                                    </a>
                                ) : (
                                    "없음"
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No races found.</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* 등록 버튼 & 페이징 버튼 정렬 */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                {/* 등록 버튼 - 왼쪽 정렬 */}
                <Link href="/race/register" passHref>
                    <Button variant="success" size="sm">
                        등록
                    </Button>
                </Link>

                {/* 페이징 - 오른쪽 정렬 */}
                <Pagination size="sm" className="mb-0">
                    <Pagination.Prev
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === page}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    />
                </Pagination>
            </div>
        </div>
    );
}
