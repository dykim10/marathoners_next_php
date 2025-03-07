/**
    특정 사용자 정보 가져오기
*/

const fetchUserInfo = async (userId) => {
    const response = await fetch(`/api/user?userId=${userId}`, {
        method: "GET",
    });

    const data = await response.json();
    if (response.ok) {
        console.log(`${userId}의 정보`, data);
    } else {
        console.error("정보 조회 실패", data.error);
    }
};