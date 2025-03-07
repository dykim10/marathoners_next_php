/**
 * 사용자가 본인 정보 보는 페이지.
 */
"use client";

import { useEffect, useState } from "react";
import { Button, Card } from 'react-bootstrap';
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user/");
                const data = await response.json();
                if (data.error) throw new Error(data.error);
                setUserData(data);
            } catch (err) {
                console.error("내 정보 조회 오류:", err);
                setError("정보를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // 회원 탈퇴 요청 함수
    const handleDeleteAccount = async () => {
        const confirmDelete = confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
        if (!confirmDelete) return;

        try {
            const response = await fetch("/api/user/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userUuid: userData.userUuid }), // userUuid 전송
            });

            if (response.ok) {
                alert("회원 탈퇴가 완료되었습니다.");
                router.push("/"); // 홈페이지로 리디렉트
            } else {
                const errorData = await response.json();
                alert(errorData.message || "탈퇴 처리 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("회원 탈퇴 오류:", error);
            alert("탈퇴 요청을 처리하는 동안 문제가 발생했습니다.");
        }
    };


    if (loading)
        return <div className="flex justify-center items-center h-screen text-lg font-semibold">로딩 중...</div>;

    if (error)
        return <div className="flex justify-center items-center h-screen text-red-600 font-semibold">{error}</div>;

    return (
        <div className="flex flex-col items-center mt-8 space-y-6">
            <UserInfoCard userData={userData}/>

            <div className="flex gap-4">
                <Button onClick={() => router.push("/user/modify")} className="w-40">
                    정보수정
                </Button>
                <Button onClick={handleDeleteAccount} className="w-40" variant="danger">
                    탈퇴하기
                </Button>
            </div>
        </div>
    );
}

function UserInfoCard({userData}) {
    return (
        <Card style={{width: "24rem"}} className="shadow-sm">
            <Card.Header className="text-center fw-bold">내 정보</Card.Header>
            <Card.Body>
                <InfoRow label="아이디" value={userData.userId}/>
                <InfoRow label="이메일" value={userData.userEmail}/>
                <InfoRow label="이름" value={userData.userName} />
            </Card.Body>
        </Card>
    );
}

function InfoRow({ label, value }) {
    return (
        <p>
            <strong className="text-gray-900">{label}:</strong> {value}
        </p>
    );
}
