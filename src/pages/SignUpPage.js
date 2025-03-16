import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, { // ✅ 엔드포인트 수정
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, nickname, password }),
            });

            if (response.ok) {
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate("/login"); // 로그인 페이지로 이동
            } else {
                const data = await response.json();
                setError(data.message || "회원가입에 실패했습니다.");
            }
        } catch (err) {
            setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>회원가입</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSignUp}>
                {/* 이메일 입력 */}
                <div className="mb-3">
                    <label className="form-label">이메일</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* 닉네임 입력 */}
                <div className="mb-3">
                    <label className="form-label">닉네임</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div className="mb-3">
                    <label className="form-label">비밀번호</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* 비밀번호 확인 입력 */}
                <div className="mb-3">
                    <label className="form-label">비밀번호 확인</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* 회원가입 버튼 */}
                <button type="submit" className="btn btn-primary">
                    회원가입
                </button>
            </form>
        </div>
    );
};

export default SignUpPage;
