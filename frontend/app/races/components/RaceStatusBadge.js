'use client';

/**
 * 대회 상태 배지 컴포넌트
 */
export default function RaceStatusBadge({ status }) {
  // 상태별 배지 색상 및 텍스트
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-500',
          text: '활성'
        };
      case 'inactive':
        return {
          color: 'bg-gray-500',
          text: '비활성'
        };
      case 'completed':
        return {
          color: 'bg-blue-500',
          text: '완료'
        };
      case 'cancelled':
        return {
          color: 'bg-red-500',
          text: '취소'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: '알 수 없음'
        };
    }
  };

  const { color, text } = getStatusInfo(status);

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${color}`}>
      {text}
    </span>
  );
} 