import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

// JWT 토큰에서 user_id 추출하는 함수
const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // JWT Payload 디코딩
        return payload.user_id; // user_id 가져오기
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};

const InterestedUniversityPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavoriteUniversities = async () => {
            const userId = getUserIdFromToken();
            const token = localStorage.getItem("token");

            if (!userId || !token) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/user/${userId}/interests`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("관심 대학 목록을 불러오는 데 실패했습니다.");
                }

                const data = await response.json();
                setFavorites(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteUniversities();
    }, []);

    if (loading) return <div className="container mt-5"><h3>로딩 중...</h3></div>;
    if (error) return <div className="container mt-5"><h3 className="text-danger">{error}</h3></div>;

    return (
        <div className="container mt-5">
            <h2>내 관심 대학 목록</h2>
            {favorites.length === 0 ? (
                <p>등록된 관심 대학이 없습니다.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Continent</th>
                            <th>Country</th>
                            <th>Name</th>
                            <th>Language</th>
                            <th>Quota</th>
                            <th>Min GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favorites.map((university) => (
                            <tr key={university.univId}>
                                <td>{university.univId}</td>
                                <td>{university.continent}</td>
                                <td>{university.country}</td>
                                <td>{university.univName}</td>
                                <td>{university.language}</td>
                                <td>{university.quota}</td>
                                <td>{university.minGpa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InterestedUniversityPage;
