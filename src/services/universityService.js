const API_URL = "http://localhost:8080/api/universities";

export const getUniversities = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch university data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching universities:", error);
        return [];
    }
};
