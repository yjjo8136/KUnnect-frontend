import React from "react";

const UniversityList = ({ universities }) => {
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
                        <th>Duration</th>
                        <th>Min Semesters</th>
                        <th>Min GPA</th>
                        <th>Language Requirements</th>
                        <th>Semester Schedule</th>
                        <th>Additional Info</th>
                    </tr>
                </thead>
                <tbody>
                    {universities.map((university) => (
                        <tr key={university.univId}>
                            <td>{university.univId}</td>
                            <td>{university.continent}</td>
                            <td>{university.country}</td>
                            <td>{university.univName}</td>
                            <td>{university.language}</td>
                            <td>{university.quota}</td>
                            <td>{university.duration}</td>
                            <td>{university.minCompletedSemesters}</td>
                            <td>{university.minGpa}</td>
                            <td>{university.languageRequirements}</td>
                            <td>{university.semesterSchedule}</td>
                            <td>{university.additionalInfo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UniversityList;
