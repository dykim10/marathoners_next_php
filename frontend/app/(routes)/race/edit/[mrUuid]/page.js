"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter, useParams } from "next/navigation";

const DatePicker = dynamic(() => import("react-datepicker").then((mod) => mod.default), { ssr: false });

export const RACE_TYPES = [
    { key: "WALK_COURSE", label: "걷기" },
    { key: "FIVE_COURSE", label: "5K" },
    { key: "TEN_COURSE", label: "10K" },
    { key: "HALF_COURSE", label: "Half" },
    { key: "FULL_COURSE", label: "풀코스" },
    { key: "FIFTY_COURSE", label: "50K" },
    { key: "HUNDRED_COURSE", label: "100K" },
    { key: "ETC_COURSE", label: "기타" },
];

export default function MarathonRaceModify({ initialData = null }) {
    const router = useRouter();
    const { mrUuid } = useParams(); // ✅ URL에서 mrUuid 가져오기

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ 비동기 데이터 불러오기 함수
    useEffect(() => {
        const fetchRaceData = async () => {
            if (!mrUuid) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/race/view/${mrUuid}`);
                if (!res.ok) throw new Error("Failed to fetch race details");

                const resData = await res.json();
                //console.log("Fetched Race Data:", resData); // ✅ 데이터 확인

                // raceCourseDetails가 undefined일 경우 빈 배열([])을 기본값으로 설정
                const raceCourses = resData.raceCourseDetailList || []; //대회에 상속된, 지원하는, 코스 데이터
                const raceData = resData.raceInfo;
                // API에서 받은 데이터를 상태에 저장
                setFormData({
                    mrUuid: raceData.mrUuid,
                    mrName: raceData.mrName,
                    mrStartDt: raceData.mrStartDt ? new Date(raceData.mrStartDt) : new Date(),
                    mrLocation: raceData.mrLocation,
                    mrCompany: raceData.mrCompany,
                    mrContent: raceData.mrContent,
                    mrHomepageUrl: raceData.mrHomepageUrl,
                    selectedRaceTypes: raceCourses.map(course => course.mrCourseType),
                    raceCourseDetails: raceCourses.reduce((acc, course) => {
                        acc[course.mrCourseType] = {
                            mrCoursePrice: course.mrCoursePrice || "",
                            mrCourseCapacity: course.mrCourseCapacity || "",
                            mrCourseEtcText: course.mrCourseEtcText || "",
                        };
                        return acc;
                    }, {}),
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching race details:", error);
                alert("대회 정보를 불러오지 못했습니다.");
                router.push("/race/list");
            }
        };

        fetchRaceData();
    }, [mrUuid, router]);

    useEffect(() => {
        if(formData) {
            //console.log(formData);
        }
    }, [formData]);

    // ✅ 로딩 중이면 Spinner 표시
    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p>대회 정보를 불러오는 중...</p>
            </Container>
        );
    }

    // ✅ 날짜 선택 핸들러
    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, mrStartDt: date }));
    };

    // ✅ 대회 유형 체크박스 변경 핸들러 (다중 선택 유지)
    const handleRaceTypeChange = (key) => {
        setFormData((prev) => {
            const updatedRaceTypes = prev.selectedRaceTypes.includes(key)
                ? prev.selectedRaceTypes.filter((type) => type !== key)
                : [...prev.selectedRaceTypes, key];

            return {
                ...prev,
                selectedRaceTypes: updatedRaceTypes,
                raceCourseDetails: {
                    ...prev.raceCourseDetails,
                    [key]: prev.raceCourseDetails[key] || { mrCoursePrice: "", mrCourseCapacity: "", mrCourseEtcText: "" },
                },
            };
        });
    };

    // ✅ 입력 필드 값 변경 핸들러
    const handleInputChange = (key, field, value) => {
        setFormData((prev) => ({
            ...prev,
            raceCourseDetails: {
                ...prev.raceCourseDetails,
                [key]: { ...prev.raceCourseDetails[key], [field]: value },
            },
        }));
    };

    //제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        //필수 입력값 검증
        if (!formData.mrName.trim()) return alert("대회명을 입력하세요.");
        if (!formData.mrStartDt) return alert("날짜를 선택하세요.");
        if (!formData.mrLocation.trim()) return alert("위치를 입력하세요.");
        if (!formData.mrContent.trim()) return alert("대회 설명을 입력하세요.");
        if (formData.selectedRaceTypes.length === 0) return alert("대회 유형을 하나 이상 선택하세요.");

        console.log("제출 데이터:", formData);
        return;

        //API 요청 데이터 구성
        const requestData = {
            mrName: formData.mrName,
            mrStartDt: formData.mrStartDt.toISOString().split("T")[0], // 날짜 포맷 yyyy-MM-dd
            mrLocation: formData.mrLocation,
            mrCompany: formData.mrCompany,
            mrContent: formData.mrContent,
            mrHomepageUrl: formData.mrHomepageUrl,
            raceCourseDetails: formData.selectedRaceTypes.map((key) => ({
                mrCourseType: key,
                mrCoursePrice: formData.raceCourseDetails[key]?.mrCoursePrice || 0,
                mrCourseCapacity: formData.raceCourseDetails[key]?.mrCourseCapacity || 0,
                mrCourseEtcText: key === "ETC_COURSE" ? formData.raceCourseDetails[key]?.mrCourseEtcText || "" : null,
            })),
        };

        try {
            const response = await fetch("/api/race/edit", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) throw new Error("서버 요청 실패");

            const result = await response.json();
            alert("대회 수정 등록 완료!");
            //console.log("서버 응답:", result);
            router.push("/race/list");

        } catch (error) {
            console.error("API 요청 오류:", error);
            alert("대회 등록에 실패했습니다.");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <h2 className="text-center">대회 수정</h2>
                    <Form onSubmit={handleSubmit}>
                        {/* 대회명 */}
                        <Form.Group className="mb-3">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <Form.Label>대회명</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={formData?.mrName || ""} // ✅ null 방지
                                        onChange={(e) => setFormData({ ...formData, mrName: e.target.value })}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* 대회 날짜 */}
                        <Form.Group className="mb-3">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <Form.Label className="m-0">대회 날짜</Form.Label>
                                </Col>
                                <Col>
                                    <DatePicker
                                        selected={formData.mrStartDt}
                                        onChange={handleDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        className="form-control" />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* 대회 장소   */}
                        <Form.Group className="mb-3">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <Form.Label>대회 장소</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={formData?.mrLocation || ""}
                                        onChange={(e) => setFormData({ ...formData, mrLocation: e.target.value })}
                                        required />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* 대회 주관사   */}
                        <Form.Group className="mb-3">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <Form.Label>대회 주관사</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={formData?.mrCompany || ""} // ✅ null 방지
                                        onChange={(e) => setFormData({ ...formData, mrCompany: e.target.value })}
                                        required />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* 대회 홈페이지   */}
                        <Form.Group className="mb-3">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <Form.Label>대회 홈페이지</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={formData?.mrHomepageUrl || ""} // ✅ null 방지
                                        onChange={(e) => setFormData({ ...formData, mrHomepageUrl: e.target.value })}
                                        required />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* 대회 유형 선택 (체크박스 + 입력 필드 한 줄 배치) */}
                        <Form.Group className="mb-3">
                            <Form.Label>대회 유형</Form.Label>
                            {RACE_TYPES.map(({ key, label }) => {
                                const isChecked = formData?.selectedRaceTypes?.includes(key) || false; // ✅ 체크박스 상태 자동 반영
                                const courseDetails = formData?.raceCourseDetails?.[key] || {}; // ✅ 필드 자동 입력

                                return (
                                    <Row key={key} className="align-items-center mb-2">
                                        {/* 체크박스 */}
                                        <Col xs="auto">
                                            <Form.Check
                                                type="checkbox"
                                                label={label}
                                                checked={isChecked}
                                                onChange={() => handleRaceTypeChange(key)}
                                            />
                                        </Col>

                                        {/* 선택된 경우 입력 필드 표시 */}
                                        {isChecked && (
                                            <>
                                                <Col>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="가격"
                                                        value={courseDetails.mrCoursePrice || ""}
                                                        onChange={(e) => handleInputChange(key, "mrCoursePrice", e.target.value)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="모집 인원"
                                                        value={courseDetails.mrCourseCapacity || ""}
                                                        onChange={(e) => handleInputChange(key, "mrCourseCapacity", e.target.value)}
                                                    />
                                                </Col>
                                                {key === "ETC_COURSE" && (
                                                    <Col>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="기타 내용"
                                                            value={courseDetails.mrCourseEtcText || ""}
                                                            onChange={(e) => handleInputChange(key, "mrCourseEtcText", e.target.value)}
                                                        />
                                                    </Col>
                                                )}
                                            </>
                                        )}
                                    </Row>
                                );
                            })}
                        </Form.Group>

                        {/* 설명 입력 (Toast UI Editor) */}
                        <Form.Group className="mb-3">
                            <Form.Label>대회 설명</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={formData?.mrContent || ""}
                                onChange={(e) => setFormData({ ...formData, mrContent: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">수정하기</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
