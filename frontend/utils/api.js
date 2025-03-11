import axios from "axios";

// API 클라이언트 생성
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
    withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 401 오류 처리 (인증 필요한 API에서만 발생)
        if (error.response && error.response.status === 401) {
            console.log('인증이 필요한 API 접근:', error.config.url);
            
            // 로그인 페이지로 리다이렉트 (선택 사항)
            // if (typeof window !== 'undefined') {
            //     window.location.href = '/login';
            // }
        }
        
        return Promise.reject(error);
    }
);

export default api;
