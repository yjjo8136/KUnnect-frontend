import React, { useEffect, useState } from "react";
import UniversityList from "../components/UniversityList";
import { getUniversities } from "../services/universityService.js";

const UniversityPage = () => {
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        getUniversities()
            .then((data) => setUniversities(data))
            .catch((error) => console.error("Error fetching universities:", error));
    }, []);

    return (
        <div>
            <UniversityList universities={universities} />
        </div>
    );
};

export default UniversityPage;
