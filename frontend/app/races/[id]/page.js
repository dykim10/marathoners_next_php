import RaceDetail from '../components/RaceDetail';

export async function generateMetadata({ params }) {
  const { id } = params;
  
  // 서버 컴포넌트에서 직접 API 호출
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/races/${id}`, {
      next: { revalidate: 60 } // 60초마다 재검증
    });
    
    if (!response.ok) {
      return {
        title: '대회 정보 없음',
        description: '요청하신 마라톤 대회 정보를 찾을 수 없습니다.'
      };
    }
    
    const data = await response.json();
    const race = data.data;
    
    return {
      title: `${race.race_name} | 마라톤 대회`,
      description: `${race.location}에서 열리는 ${race.race_name} 마라톤 대회 정보입니다.`
    };
  } catch (error) {
    return {
      title: '마라톤 대회 정보',
      description: '마라톤 대회 상세 정보 페이지입니다.'
    };
  }
}

export default function RaceDetailPage({ params }) {
  const { id } = params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <RaceDetail id={id} />
    </div>
  );
} 