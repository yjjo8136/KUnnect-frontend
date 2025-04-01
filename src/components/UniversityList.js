import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

const UniversityList = ({ universities, onUniversityClick, addToFavorites }) => {
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

  const toggleFavorite = async (univId, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 구분
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

  const handleChatClick = (univId, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 구분
    navigate(`/chat/${univId}`);
  };

  const handleExpandClick = (univId, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 구분
    setExpandedUnivId(expandedUnivId === univId ? null : univId);
  };

  if (universities.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">검색된 대학이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="row">
      {universities.map((university) => {
        const isFavorite = favoriteUniversities.includes(university.univId);
        const isExpanded = expandedUnivId === university.univId;

        return (
          <div
            key={university.univId}
            className="col-12 col-md-6 col-lg-4 mb-4"
            onClick={() =>
              onUniversityClick(university.latitude, university.longitude)
            }
            style={{ cursor: "pointer" }}
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-2">{university.univName}</h5>
                <p className="card-text mb-1">
                  <strong>대륙:</strong> {university.continent} |{" "}
                  <strong>국가:</strong> {university.country}
                </p>
                <p className="card-text mb-1">
                  <strong>언어:</strong> {university.language}
                </p>
                <p className="card-text mb-1">
                  <strong>정원:</strong> {university.quota}
                </p>
                <p className="card-text mb-1">
                  <strong>최소 GPA:</strong> {university.minGpa}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div>
                  <button
                    className={`btn btn-sm me-2 ${
                      isFavorite ? "btn-danger" : "btn-outline-primary"
                    }`}
                    onClick={(e) => toggleFavorite(university.univId, e)}
                  >
                    {isFavorite ? "관심 해제" : "관심 추가"}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => handleChatClick(university.univId, e)}
                  >
                    채팅하기
                  </button>
                </div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={(e) => handleExpandClick(university.univId, e)}
                >
                  {isExpanded ? "접기" : "더보기"}
                </button>
              </div>
              {/* 더보기 내용 */}
              {isExpanded && (
                <div className="px-3 py-2">
                  <hr />
                  <p className="mb-1">
                    <strong>Duration:</strong> {university.duration}
                  </p>
                  <p className="mb-1">
                    <strong>Min Completed Semesters:</strong>{" "}
                    {university.minCompletedSemesters}
                  </p>
                  <p className="mb-1">
                    <strong>Language Requirements:</strong>{" "}
                    {university.languageRequirements}
                  </p>
                  <p className="mb-1">
                    <strong>Semester Schedule:</strong>{" "}
                    {university.semesterSchedule}
                  </p>
                  {university.additionalInfo && (
                    <p className="mb-1">
                      <strong>Additional Info:</strong>{" "}
                      {university.additionalInfo}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UniversityList;
