const Dashboard = ({ onLogout }) => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">대시보드</h2>
        <p>로그인 성공! JWT를 저장했습니다.</p>
        <button onClick={onLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          로그아웃
        </button>
      </div>
    );
  };
  
  export default Dashboard;
  