const API_URL = process.env.REACT_APP_API_URL + "/api/universities";

// 🌍 대학 목록 가져오기 (필터링 및 검색 지원)
export const getUniversities = async (continent = "", country = "", search = "") => {
    try {
        const queryParams = new URLSearchParams();
        if (continent) queryParams.append("continent", continent);
        if (country) queryParams.append("country", country);
        if (search) queryParams.append("search", search);

        const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기

        const response = await fetch(`${API_URL}?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // 🔥 JWT 토큰 추가
                "Content-Type": "application/json"
            },
            credentials: "include" // 🔥 인증 요청 시 필수 (CORS 관련 문제 방지)
        });

        if (!response.ok) {
            throw new Error("Failed to fetch university data");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching universities:", error);
        return [];
    }
};
