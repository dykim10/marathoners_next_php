import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // 환경 변수에서 API URL 가져오기

const api = axios.create({
    baseURL: API_URL, // 로컬 or 프로덕션 환경에 따라 자동 변경됨
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
