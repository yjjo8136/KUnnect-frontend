// components/UniversityList.js
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const UniversityList = ({ universities, onUniversityClick, addToFavorites }) => {
    const [expandedUnivId, setExpandedUnivId] = useState(null);

    const toggleExpand = (univId) => {
        setExpandedUnivId((prevId) => (prevId === univId ? null : univId));
    };

    return (
        <div className="list-group">
            {universities.map((univ) => (
                <div key={univ.univId} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                        <div onClick={() => onUniversityClick(univ.latitude, univ.longitude)} style={{ cursor: "pointer" }}>
                            <strong>{univ.univName}</strong> - {univ.country}
                        </div>
                        <div>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => addToFavorites(univ.univId)}>★</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleExpand(univ.univId)}>
                                {expandedUnivId === univ.univId ? <FaMinus /> : <FaPlus />}
                            </button>
                        </div>
                    </div>

                    {/* 상세 정보 토글 */}
                    {expandedUnivId === univ.univId && (
                        <div className="mt-2 ps-3">
                            <p><strong>Continent:</strong> {univ.continent}</p>
                            <p><strong>Language:</strong> {univ.language}</p>
                            <p><strong>Quota:</strong> {univ.quota}</p>
                            <p><strong>Duration:</strong> {univ.duration}</p>
                            <p><strong>Min Completed Semesters:</strong> {univ.minCompletedSemesters}</p>
                            <p><strong>Min GPA:</strong> {univ.minGpa}</p>
                            <p><strong>Language Requirements:</strong> {univ.languageRequirements}</p>
                            <p><strong>Semester Schedule:</strong> {univ.semesterSchedule}</p>
                            {univ.additionalInfo && <p><strong>Additional Info:</strong> {univ.additionalInfo}</p>}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UniversityList;
