import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      onLogin(token);
      navigate("/universities");
    } catch (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center pt-20 container mt-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md w-96">
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="border p-2 w-full placeholder-gray-400"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="border p-2 w-full placeholder-gray-400"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          로그인
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        계정이 없으신가요?
        <button
          onClick={() => navigate("/signup")}
          className="text-blue-500 underline ml-2"
        >
          회원가입
        </button>
      </p>
    </div>
  );
};

export default LoginPage;