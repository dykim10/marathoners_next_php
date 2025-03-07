"use client";

import UserForm from "@/app/components/UserForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const handleRegister = async (formData) => {
        const response = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            router.push("/auth/login");
        } else {
            alert("회원가입 실패");
        }
    };

    return <UserForm onSubmit={handleRegister} />;
}
