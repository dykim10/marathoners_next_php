"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

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

export default function MarathonRegister({ initialData = null }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        mrName: initialData?.mrName || "",
        mrStartDt: initialData?.mrStartDt ? new Date(initialData.mrStartDt) : new Date(),
        mrLocation: initialData?.mrLocation || "",
        mrCompany: initialData?.mrCompany || "",
        mrContent: initialData?.mrContent || "",
        mrHomepageUrl: initialData?.mrHomepageUrl || "",
        selectedRaceTypes: initialData?.selectedRaceTypes || [],
        raceCourseDetails: initialData?.raceCourseDetails || {},
    });

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
            const response = await fetch("/api/race/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) throw new Error("서버 요청 실패");

            const result = await response.json();
            alert("대회 등록 완료!");
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
                    <h2 className="text-center">대회 등록</h2>
                    <Form onSubmit={handleSubmit}>
                        {/* 대회명 */}
                        <Form.Group className="mb-3">
                            <Row className="align-items-center">
                                <Col xs={3}>
                                    <Form.Label>대회명</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control type="text" value={formData.mrName} onChange={(e) => setFormData({ ...formData, mrName: e.target.value })} required />
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
                                    <DatePicker selected={formData.mrStartDt} onChange={handleDateChange} dateFormat="yyyy-MM-dd" className="form-control" />
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
                                    <Form.Control type="text" value={formData.mrLocation} onChange={(e) => setFormData({ ...formData, mrLocation: e.target.value })} required />
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
                                    <Form.Control type="text" value={formData.mrCompany} onChange={(e) => setFormData({ ...formData, mrCompany: e.target.value })} required />
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
                                    <Form.Control type="text" value={formData.mrHomepageUrl} onChange={(e) => setFormData({ ...formData, mrHomepageUrl: e.target.value })} required />
                                </Col>
                            </Row>
                        </Form.Group>
                        
                        {/* 대회 유형 선택 (체크박스 + 입력 필드 한 줄 배치) */}
                        <Form.Group className="mb-3">
                            <Form.Label>대회 유형</Form.Label>
                            {RACE_TYPES.map(({ key, label }) => (
                                <Row key={key} className="align-items-center mb-2">
                                    <Col xs="auto">
                                        <Form.Check type="checkbox" label={label} checked={formData.selectedRaceTypes.includes(key)} onChange={() => handleRaceTypeChange(key)} />
                                    </Col>
                                    {formData.selectedRaceTypes.includes(key) && (
                                        <>
                                            <Col>
                                                <Form.Control type="number" placeholder="가격" value={formData.raceCourseDetails[key]?.mrCoursePrice || ""} onChange={(e) => handleInputChange(key, "mrCoursePrice", e.target.value)} />
                                            </Col>
                                            <Col>
                                                <Form.Control type="number" placeholder="모집 인원" value={formData.raceCourseDetails[key]?.mrCourseCapacity || ""} onChange={(e) => handleInputChange(key, "mrCourseCapacity", e.target.value)} />
                                            </Col>
                                            {key === "ETC_COURSE" && (
                                                <Col>
                                                    <Form.Control type="text" placeholder="기타 내용" value={formData.raceCourseDetails[key]?.mrCourseEtcText || ""} onChange={(e) => handleInputChange(key, "mrCourseEtcText", e.target.value)} />
                                                </Col>
                                            )}
                                        </>
                                    )}
                                </Row>
                            ))}
                        </Form.Group>

                        {/* 설명 입력 (Toast UI Editor) */}
                        <Form.Group className="mb-3">
                            <Form.Label>대회 설명</Form.Label>
                            <Form.Control as="textarea" rows={5} value={formData.mrContent} onChange={(e) => setFormData({ ...formData, mrContent: e.target.value })} required />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {initialData ? "수정하기" : "등록하기"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
