import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UniversityPage from "./pages/UniversityPage";
import UniversityDetailPage from "./pages/UniversityDetailPage";
import ChatPage from "./pages/ChatPage.js";
import InterestedUniversityPage from "./pages/InterestedUniversityPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken, logout } from "./services/authService";

const App = () => {
    const [token, setToken] = useState(getToken());

    useEffect(() => {
        console.log("현재 토큰:", token);
    }, [token]);

    const handleLogin = (jwtToken) => {
        setToken(jwtToken);
    };

    const handleLogout = () => {
        logout();
        setToken(null);
    };

    return (
        <Router>
            <Navbar /> {/* ✅ 네비게이션 바 추가 */}
            <Routes>
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/universities" element={<UniversityPage />} />
                <Route path="/university/:univId" element={<UniversityDetailPage />} />
                <Route
                    path="/favorites"
                    element={
                        <ProtectedRoute>
                            <InterestedUniversityPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/chat/:univId" element={<ChatPage />} />
                <Route path="/" element={token ? <Navigate to="/universities" /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
