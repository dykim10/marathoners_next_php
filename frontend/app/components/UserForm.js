/**
 * 회원가입 / 회원 정보수정 공통파일 모듈화
 */
"use client";

import { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

export default function UserForm({ initialData = {}, onSubmit, isEdit = false }) {
    const [formData, setFormData] = useState(() => ({
        userUuid: initialData?.userUuid || "",
        userId: initialData?.userId || "",
        userEmail: initialData?.userEmail || "",
        userPassword: "",
        userName: initialData?.userName || "",
    }));

    const [validationErrors, setValidationErrors] = useState({});
    const [checkMessage, setCheckMessage] = useState({ userId: null, userEmail: null });
    const [isChecked, setIsChecked] = useState({ userId: false, userEmail: false });

    const [originalEmail] = useState(initialData?.userEmail || ""); // 기존 이메일 저장
    const [originalPassword] = useState(""); // 기존 비밀번호는 보안상 클라이언트에 제공되지 않음.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setCheckMessage((prev) => ({ ...prev, [name]: null }));

        // 회원가입 시 중복 확인 리셋
        if (!isEdit) {
            setIsChecked((prev) => ({ ...prev, [name]: false }));
        }
    };

    //중복 확인 기능 유지
    const checkDuplicate = async (type) => {
        const value = formData[type];
        if (!value) {
            alert("값을 입력해주세요.");
            return "UNKNOWN";
        }

        try {
            const response = await fetch("/api/check-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, value }),
            });

            const data = await response.json();
            const userExistsStatus = data.userExists || "UNKNOWN";
            const existsMessage = userExistsStatus.includes("EXISTS") ? "이미 사용 중입니다." : "사용 가능합니다.";

            setCheckMessage((prev) => ({ ...prev, [type]: existsMessage }));
            setIsChecked((prev) => ({ ...prev, [type]: userExistsStatus !== "USERID_EXISTS" && userExistsStatus !== "EMAIL_EXISTS" }));

            return userExistsStatus;
        } catch (error) {
            console.error(`${type} 중복 확인 실패:`, error);
            setCheckMessage((prev) => ({ ...prev, [type]: "서버 오류가 발생했습니다." }));
            return "ERROR";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};

        if (!/^[a-zA-Z0-9]{4,16}$/.test(formData.userId)) errors.userId = "아이디는 4~16자 영어 또는 숫자만 입력 가능합니다.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) errors.userEmail = "이메일 형식이 올바르지 않습니다.";
        if (!isEdit && !/^(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/.test(formData.userPassword)) {
            errors.userPassword = "비밀번호는 영문자와 특수문자를 포함하여 8자 이상이어야 합니다.";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // 최종 중복 확인 로직 (회원가입 시에만 필요)
        if (!isEdit) {
            const idCheck = isChecked.userId ? "NOT_FOUND" : await checkDuplicate("userId");
            if (idCheck === "USERID_EXISTS") {
                setValidationErrors((prev) => ({ ...prev, userId: "이미 사용 중인 아이디입니다." }));
                return;
            }

            const emailCheck = isChecked.userEmail ? "NOT_FOUND" : await checkDuplicate("userEmail");
            if (emailCheck === "EMAIL_EXISTS") {
                setValidationErrors((prev) => ({ ...prev, userEmail: "이미 등록된 이메일입니다." }));
                return;
            }

        }

        // 회원정보 수정 시 기존 이메일과 다를 때만 중복 확인
        if (isEdit && formData.userEmail !== originalEmail) {
            const emailCheck = isChecked.userEmail ? "NOT_FOUND" : await checkDuplicate("userEmail");
            if (emailCheck === "EMAIL_EXISTS") {
                setValidationErrors((prev) => ({ ...prev, userEmail: "이미 등록된 이메일입니다." }));
                return;
            }
        }

        //비밀번호 & 이메일이 변경되지 않았으면 FormData에서 제외
        const finalFormData = { ...formData };

        if (isEdit) {
            if (!formData.userPassword) {
                delete finalFormData.userPassword; // 비밀번호가 입력되지 않았으면 전송하지 않음
            }
            if (formData.userEmail === originalEmail) {
                delete finalFormData.userEmail; // 기존 이메일과 같으면 전송하지 않음
            }
        }

        onSubmit(finalFormData);
    };

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSubmit} autoComplete="off">
                {/* 아이디 입력 (회원정보 수정 시 수정 불가) */}
                <Form.Group className="mb-3">
                    <Row className="align-items-center">
                        <Col xs={3}>
                            <Form.Label>아이디</Form.Label>
                        </Col>
                        <Col xs={6}>
                            <Form.Control
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                disabled={isEdit} // ✅ 회원정보 수정 시 수정 불가능
                                required
                                autoComplete="off"
                            />
                        </Col>
                        {!isEdit && (
                            <Col xs={3}>
                                <Button variant="outline-secondary" size="sm" onClick={() => checkDuplicate("userId")}>
                                    중복 확인
                                </Button>
                            </Col>
                        )}
                    </Row>
                    {checkMessage.userId && <div className={`mt-2 ${checkMessage.userId.includes("가능") ? "text-green-500" : "text-red-500"}`}>{checkMessage.userId}</div>}
                </Form.Group>

                {/* 이메일 입력 & 중복 확인 */}
                <Form.Group className="mb-3">
                    <Row className="align-items-center">
                        <Col xs={3}>
                            <Form.Label>이메일</Form.Label>
                        </Col>
                        <Col xs={6}>
                            <Form.Control
                                type="email"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </Col>
                        {
                            <Col xs={3}>
                                <Button variant="outline-secondary" size="sm" onClick={() => checkDuplicate("userEmail")}>
                                    중복 확인
                                </Button>
                            </Col>
                        }
                    </Row>
                    {checkMessage.userEmail && <div className={`mt-2 ${checkMessage.userEmail.includes("가능") ? "text-green-500" : "text-red-500"}`}>{checkMessage.userEmail}</div>}
                </Form.Group>

                {/* 비밀번호 입력 (회원가입 및 회원정보 수정 시 가능) */}
                <Form.Group className="mb-3">
                    <Row className="align-items-center">
                        <Col xs={3}>
                            <Form.Label>{isEdit ? "새 비밀번호 (선택)" : "비밀번호"}</Form.Label>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                type="password"
                                name="userPassword"
                                value={formData.userPassword}
                                onChange={handleChange}
                                required={!isEdit}
                                autoComplete="new-password"
                                placeholder={isEdit ? "변경할 경우에만 입력하세요." : ""}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                {/* 이름 입력 */}
                <Form.Group className="mb-3">
                    <Row className="align-items-center">
                        <Col xs={3}>
                            <Form.Label>이름</Form.Label>
                        </Col>
                        <Col xs={9}>
                            <Form.Control
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </Col>
                    </Row>
                </Form.Group>

                {/* 에러 메시지 표시 */}
                {Object.values(validationErrors).map((error, index) => (
                    <Alert key={index} variant="danger">{error}</Alert>
                ))}

                {/* 제출 버튼 */}
                <Button variant="primary" type="submit" className="w-100">
                    {isEdit ? "정보 수정" : "회원가입"}
                </Button>
            </Form>
        </Container>
    );
}
