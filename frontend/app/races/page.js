import RaceList from './components/RaceList';

export const metadata = {
  title: '마라톤 대회 목록',
  description: '모든 마라톤 대회 목록을 확인하세요.',
};

export default function RacesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">마라톤 대회 목록</h1>
      <RaceList />
    </div>
  );
} 