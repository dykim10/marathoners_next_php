import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProviderWrapper } from '../components/AuthProvider';
// Next.js에서는 @/를 사용하여 app/ 폴더 기준으로 경로를 설정할 수 있습니다. - checkpoint

// 메타데이터 정의 (서버 컴포넌트에서만 가능)
export const metadata = {
    title: "Team Pac",
    description: "Next.js (Front End)와 CodeIgniter4(Back End / API) 연결하여 스터디 & 개인 과제 프로젝트",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <head>
            <title>Team PAC</title>
            <meta name="description" content="Team Pac의 메인 페이지입니다." />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
            <AuthProviderWrapper>
                <Header />  {/*헤더 추가 */}
                <main>{children}</main>
                <Footer />  {/*푸터 추가 */}
            </AuthProviderWrapper>
        </body>
        </html>
    );
}