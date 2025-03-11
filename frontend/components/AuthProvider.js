'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { checkSession } from '../utils/session';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 실제 상태 관리 및 컨텍스트 제공 컴포넌트 (클라이언트 컴포넌트)
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authMessage, setAuthMessage] = useState('');

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const result = await checkSession();
                
                setIsAuthenticated(result.isAuthenticated);
                setUser(result.user);
                setAuthMessage(result.message || '');
            } catch (error) {
                console.error('인증 확인 중 오류 발생:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            // 로그아웃 API 호출
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            
            // 상태 업데이트
            setUser(null);
            setIsAuthenticated(false);
            
            // 쿠키 삭제 (클라이언트 측)
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            isLoading, 
            authMessage,
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// 서버 컴포넌트에서 사용할 수 있는 래퍼 컴포넌트 (클라이언트 컴포넌트를 감싸는 용도)
export function AuthProviderWrapper({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}

// 인증 컨텍스트 사용을 위한 훅
export function useAuth() {
    return useContext(AuthContext);
} 