"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api"; //axios 인스턴스를 import

export default function MessagesPage() {
    const [messages, setMessages] = useState([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState(""); // 입력할 새 메시지

    // ✅ 컴포넌트가 마운트될 때 메시지 목록 불러오기
    useEffect(() => {
        fetchMessages();
    }, []);

    // ✅ 메시지 목록 가져오기
    const fetchMessages = async () => {
        try {
            const { data } = await api.get("/api/messages");
            setMessages(data);
        } catch (error) {
            console.error("메시지를 불러오는 중 오류 발생:", error);
        }
    };

    // ✅ 메시지 추가 함수
    const handleAddMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await api.post("/api/messages", { message: newMessage });
            setNewMessage(""); // 입력 필드 초기화
            fetchMessages(); // 목록 갱신
        } catch (error) {
            console.error("메시지를 추가하는 중 오류 발생:", error);
        }
    };

    // ✅ 메시지 삭제 함수
    const handleDeleteMessage = async (id) => {
        try {
            await api.delete(`/api/messages/${id}`);
            fetchMessages(); // 목록 갱신
        } catch (error) {
            console.error("메시지를 삭제하는 중 오류 발생:", error);
        }
    };

    return (
            <div className="container">
                <h1>메시지 목록</h1>

                {/* 메시지 입력 폼 */}
                <div className="input-group">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="새 메시지를 입력하세요"
                    />
                    <button onClick={handleAddMessage}>추가</button>
                </div>

                {/* 메시지 목록 */}
                <ul>
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <li key={msg.id}>
                                <span>{msg.message}</span>
                                <button onClick={() => handleDeleteMessage(msg.id)}>삭제</button>
                            </li>
                        ))
                    ) : (
                        <p>메시지가 없습니다.</p>
                    )}
                </ul>

            </div>
    );
}
