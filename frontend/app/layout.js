import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { SessionProvider } from "next-auth/react"; // ✅ SessionProvider 추가

// Next.js에서는 @/를 사용하여 app/ 폴더 기준으로 경로를 설정할 수 있습니다. - checkpoint

export const metadata = {
    title: "Marathoners ",
    description: "Next.js와 Spring Boot를 연결하여 공부, 스터디, 개인 과제 목표로 하는 프로젝트",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <head>
            <title>Marathoners</title>
            <meta name="description" content="Marathoners의 메인 페이지입니다." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>

            <Header />  {/*헤더 추가 */}
            <main>{children}</main>
            <Footer />  {/*푸터 추가 */}

        </body>
        </html>
    );
}