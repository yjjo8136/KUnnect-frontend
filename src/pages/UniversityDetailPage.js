import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = process.env.REACT_APP_API_URL;

const UniversityDetailPage = () => {
  const { univId } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  // 예시: 날씨, 환율, 블로그/유튜브 리뷰 등 추가 데이터
  const [weather, setWeather] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [blogReviews, setBlogReviews] = useState([]);
  const [youtubeReviews, setYoutubeReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) 대학 상세 정보
        const resUniv = await fetch(`${API_URL}/api/universities/${univId}`);
        if (resUniv.ok) {
          const univData = await resUniv.json();
          setUniversity(univData);
        }

        // 2) 날씨 정보 (실제 API 호출 or mock)
        //    예: const resWeather = await fetch(`https://api.openweathermap.org/...`);
        //    여기서는 간단히 mock:
        setWeather({
          temp: "7°C",
          description: "구름 조금",
        });

        // 3) 환율 정보 (실제 API 호출 or mock)
        setExchangeRate("1 USD = 1,300 KRW");

        // 4) 블로그 리뷰 (mock)
        setBlogReviews([
          {
            title: "블로그 리뷰 1",
            snippet: "이 대학에 다녀왔는데...",
          },
          {
            title: "블로그 리뷰 2",
            snippet: "파견 생활 꿀팁 정리...",
          },
        ]);

        // 5) 유튜브 리뷰 (mock)
        setYoutubeReviews([
          {
            title: "교환학생 브이로그",
            thumbnail: "https://img.youtube.com/vi/xxx/default.jpg",
          },
          {
            title: "대학교 캠퍼스 투어",
            thumbnail: "https://img.youtube.com/vi/yyy/default.jpg",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching university details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [univId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="container py-5 text-center">
        <p>해당 대학 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="university-detail-page">
      {/* 상단 이미지 섹션 (가로 전체 배경 이미지) */}
      <div
        className="detail-hero"
        style={{
          backgroundImage: `url("https://via.placeholder.com/1200x400")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          alignItems: "flex-end",
          color: "#fff",
        }}
      >
        <div className="container mb-3">
          <h2 className="fw-bold">{university.univName}</h2>
          <p>
            {university.country} / {university.continent}
          </p>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className="container py-4">
        <div className="row mb-3">
          {/* 날씨 */}
          <div className="col-12 col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">날씨</h5>
                {weather ? (
                  <>
                    <p>온도: {weather.temp}</p>
                    <p>상태: {weather.description}</p>
                  </>
                ) : (
                  <p>날씨 정보를 불러올 수 없습니다.</p>
                )}
              </div>
            </div>
          </div>
          {/* 환율 */}
          <div className="col-12 col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">환율</h5>
                {exchangeRate ? (
                  <p>{exchangeRate}</p>
                ) : (
                  <p>환율 정보를 불러올 수 없습니다.</p>
                )}
              </div>
            </div>
          </div>
          {/* 방값 or 생활비 (예시) */}
          <div className="col-12 col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">생활비</h5>
                <p>
                  {/* 예시로 학비, 기숙사 비용, etc. */}
                  평균 월 1,000 USD (예시)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 지도 & 대학 정보 */}
        <div className="row mb-4">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <h5>지도</h5>
            {/* 간단히 iframe 예시 or Leaflet/Google Maps API */}
            <iframe
              title="map"
              src={`https://maps.google.com/maps?q=${university.latitude},${university.longitude}&z=12&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="col-12 col-md-6">
            <h5>대학정보</h5>
            <ul>
              <li>언어: {university.language}</li>
              <li>정원: {university.quota}</li>
              <li>최소 GPA: {university.minGpa}</li>
              <li>Duration: {university.duration}</li>
              <li>Min Completed Semesters: {university.minCompletedSemesters}</li>
              <li>Language Requirements: {university.languageRequirements}</li>
              <li>Semester Schedule: {university.semesterSchedule}</li>
              {university.additionalInfo && <li>{university.additionalInfo}</li>}
            </ul>
          </div>
        </div>

        {/* 블로그 리뷰, 유튜브 리뷰 섹션 */}
        <div className="row mb-4">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <h5>블로그 리뷰</h5>
            {blogReviews.map((review, idx) => (
              <div key={idx} className="mb-2 p-2 border rounded">
                <strong>{review.title}</strong>
                <p className="mb-0 text-muted">{review.snippet}</p>
              </div>
            ))}
          </div>
          <div className="col-12 col-md-6">
            <h5>유튜브 리뷰</h5>
            {youtubeReviews.map((video, idx) => (
              <div key={idx} className="mb-2 p-2 border rounded d-flex">
                <img
                  src={video.thumbnail}
                  alt="thumbnail"
                  style={{ width: "80px", height: "60px", marginRight: "10px" }}
                />
                <div>
                  <strong>{video.title}</strong>
                  <p className="mb-0 text-muted">유튜브 링크 예시</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailPage;
