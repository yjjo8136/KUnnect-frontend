import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UniversityPage from "./pages/UniversityPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UniversityPage />} />
            </Routes>
        </Router>
    );
}

export default App;
