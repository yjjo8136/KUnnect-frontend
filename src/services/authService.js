export const login = async (email, password) => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error("로그인 실패");
    }
  
    const data = await response.json();
    return data.token;
  };
  
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };
  