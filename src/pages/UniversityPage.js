import React, { useEffect, useState } from "react";
import UniversityList from "../components/UniversityList";
import UniversityMap from "../components/UniversityMap";
import { getUniversities } from "../services/universityService";

const API_URL = process.env.REACT_APP_API_URL;

const UniversityPage = () => {
    const [universities, setUniversities] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [mapCenter, setMapCenter] = useState([20, 0]); // 🌍 기본 지도 위치
    const [mapZoom, setMapZoom] = useState(2); // 🔍 기본 줌 레벨
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        getUniversities(selectedContinent, selectedCountry, searchQuery)
            .then((data) => setUniversities(data))
            .catch((error) => console.error("Error fetching universities:", error));
    }, [selectedContinent, selectedCountry, searchQuery]);

    useEffect(() => {
        // JWT 토큰과 유저 ID 가져오기
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("user_id"); // 유저 ID 저장되어 있다고 가정
        setIsLoggedIn(!!token);
        if (storedUserId) setUserId(storedUserId);
    }, []);

    // 📌 클릭 시 지도 이동
    const handleUniversityClick = (latitude, longitude) => {
        setMapCenter([latitude, longitude]);
        setMapZoom(8); // 🔍 줌인
    };



    // 관심 대학 추가 기능
    const addToFavorites = async (univId) => {
        if (!isLoggedIn || !userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            console.log("fdsfasfd");
            const response = await fetch(`${API_URL}/api/user/${userId}/interests/${univId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT 토큰 추가
                },
            });

            if (response.ok) {
                alert("관심 대학에 추가되었습니다!");
            } else {
                const data = await response.json();
                alert(data.message || "관심 대학 추가에 실패했습니다.");
            }
        } catch (err) {
            alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>University Information</h2>

            {/* 🌍 대륙 필터링 */}
            <div className="mb-3">
                <label className="form-label">Filter by Continent:</label>
                <select className="form-select" value={selectedContinent} onChange={(e) => setSelectedContinent(e.target.value)}>
                    <option value="">All</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="North America">North America</option>
                </select>
            </div>

            {/* 🏳 국가 필터링 */}
            <div className="mb-3">
                <label className="form-label">Filter by Country:</label>
                <select className="form-select" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                    <option value="">All</option>
                    <option value="영국">영국</option>
                    <option value="미국">미국</option>
                    <option value="일본">일본</option>
                </select>
            </div>

            {/* 🔎 대학 검색 */}
            <div className="mb-3">
                <label className="form-label">Search University:</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter university name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* 📌 대학 목록 */}
            <UniversityList
                universities={universities}
                onUniversityClick={handleUniversityClick}
                addToFavorites={addToFavorites} // 관심 대학 추가 기능 전달
            />

            {/* 🗺️ 지도 */}
            <h2 className="mt-4">University Locations</h2>
            <UniversityMap universities={universities} center={mapCenter} zoom={mapZoom} />
        </div>
    );
};

export default UniversityPage;
