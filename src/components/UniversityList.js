import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id;
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};

const UniversityList = ({ universities, onUniversityClick }) => {
    const [favoriteUniversities, setFavoriteUniversities] = useState([]);
    const [expandedUnivId, setExpandedUnivId] = useState(null); // ✅ 더보기 상태
    const userId = getUserIdFromToken();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId || !token) return;

        const fetchFavorites = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/${userId}/interests`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setFavoriteUniversities((prevFavorites) =>
                    isFavorite
                        ? prevFavorites.filter((id) => id !== univId)
                        : [...prevFavorites, univId]
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
                        <th>Actions</th>
                        <th>Chat</th>
                        <th>More</th> {/* ✅ 더보기 컬럼 추가 */}
                    </tr>
                </thead>
                <tbody>
                    {universities.map((university) => {
                        const isFavorite = favoriteUniversities.includes(university.univId);
                        const isExpanded = expandedUnivId === university.univId;

                        return (
                            <React.Fragment key={university.univId}>
                                <tr
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
                                                e.stopPropagation();
                                                toggleFavorite(university.univId);
                                            }}
                                        >
                                            {isFavorite ? "관심등록 제거" : "관심 대학 추가"}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/chat/${university.univId}`);
                                            }}
                                        >
                                            채팅하기
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedUnivId(isExpanded ? null : university.univId);
                                            }}
                                        >
                                            {isExpanded ? "접기" : "더보기"}
                                        </button>
                                    </td>
                                </tr>

                                {/* ✅ 더보기 내용 표시 */}
                                {isExpanded && (
                                    <tr>
                                        <td colSpan="10">
                                            <div className="p-2 bg-light rounded">
                                                <p><strong>Duration:</strong> {university.duration}</p>
                                                <p><strong>Min Completed Semesters:</strong> {university.minCompletedSemesters}</p>
                                                <p><strong>Language Requirements:</strong> {university.languageRequirements}</p>
                                                <p><strong>Semester Schedule:</strong> {university.semesterSchedule}</p>
                                                {university.additionalInfo && (
                                                    <p><strong>Additional Info:</strong> {university.additionalInfo}</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UniversityList;
