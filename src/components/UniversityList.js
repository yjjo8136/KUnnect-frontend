import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가

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

const UniversityList = ({ universities, onUniversityClick }) => {
    const [favoriteUniversities, setFavoriteUniversities] = useState([]);
    const userId = getUserIdFromToken();
    const token = localStorage.getItem("token");
    const navigate = useNavigate(); // ✅ useNavigate 훅 사용

    // 관심 대학 목록 가져오기
    useEffect(() => {
        if (!userId || !token) return;

        const fetchFavorites = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/${userId}/interests`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFavoriteUniversities(data.map((uni) => uni.univId));
                }
            } catch (error) {
                console.error("Error fetching favorite universities:", error);
            }
        };

        fetchFavorites();
    }, [userId, token]);

    // 관심 대학 추가/제거 기능
    const toggleFavorite = async (univId) => {
        if (!userId || !token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isFavorite = favoriteUniversities.includes(univId);
        const method = isFavorite ? "DELETE" : "POST";
        const url = `${API_URL}/api/user/${userId}/interests/${univId}`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setFavoriteUniversities((prevFavorites) =>
                    isFavorite
                        ? prevFavorites.filter((id) => id !== univId) // 제거
                        : [...prevFavorites, univId] // 추가
                );
            } else {
                alert("관심 대학 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error toggling favorite university:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>University List</h2>
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
                        <th>Actions</th> {/* 새로운 컬럼 추가 */}
                        <th>Chat</th> {/* 새로운 컬럼 추가 */}
                    </tr>
                </thead>
                <tbody>
                    {universities.map((university) => {
                        const isFavorite = favoriteUniversities.includes(university.univId);
                        return (
                            <tr
                                key={university.univId}
                                onClick={() => onUniversityClick(university.latitude, university.longitude)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{university.univId}</td>
                                <td>{university.continent}</td>
                                <td>{university.country}</td>
                                <td>{university.univName}</td>
                                <td>{university.language}</td>
                                <td>{university.quota}</td>
                                <td>{university.minGpa}</td>
                                <td>
                                    <button
                                        className={`btn ${isFavorite ? "btn-danger" : "btn-outline-primary"} btn-sm`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // 부모 클릭 이벤트 방지
                                            toggleFavorite(university.univId);
                                        }}
                                    >
                                        {isFavorite ? "관심등록 제거" : "관심 대학 추가"}
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 부모 클릭 이벤트 방지
                                            navigate(`/chat/${university.univId}`);
                                        }}
                                    >
                                        채팅하기
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UniversityList;
