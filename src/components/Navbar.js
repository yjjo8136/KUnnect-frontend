import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getToken, logout } from "../services/authService";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = getToken();

    // 로그인 & 회원가입 페이지에서는 네비게이션 바 숨기기
    if (location.pathname === "/login" || location.pathname === "/signup") {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">KUnnect</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">대시보드</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/universities">대학 목록</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/favorites">관심 대학</Link>
                        </li>
                    </ul>
                    {token ? (
                        <button className="btn btn-outline-light" onClick={handleLogout}>로그아웃</button>
                    ) : (
                        <Link className="btn btn-outline-light" to="/login">로그인</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
