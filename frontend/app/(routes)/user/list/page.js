"use client";

import { useState, useEffect } from "react";
import { Table, Form, Button, Pagination, Dropdown } from "react-bootstrap";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [keyword, page, rows]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/userlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    keyword,
                    page,
                    rows
                }),
            });
            if (!res.ok) throw new Error("Failed to fetch tb_users");
            const data = await res.json();

            //console.log(data.users);
            setUsers(data.users);
            setTotalPages(data.totalPages);


        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>회원 리스트</h2>
            <Form className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="아이디 또는 이름 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </Form>

            <Dropdown className="mb-3">
                <Dropdown.Toggle variant="secondary">
                    목록 개수: {rows}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {[10, 20, 50].map((num) => (
                        <Dropdown.Item key={num} onClick={() => setRows(num)}>
                            {num}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>가입일</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.userName}</td>
                        <td>{user.userEmail}</td>
                        <td>{new Date(user.userRegDt).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Pagination>
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
    );
}
