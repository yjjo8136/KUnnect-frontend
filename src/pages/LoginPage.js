import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { login } from "../services/authService";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      onLogin(token);
      navigate("/universities"); // 로그인 성공 시 이동
    } catch (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">로그인</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          로그인
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
