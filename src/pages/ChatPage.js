import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_URL = process.env.REACT_APP_API_URL;

const ChatPage = () => {
    const { univId } = useParams();
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [jwtToken, setJwtToken] = useState("");
    const [nickname, setNickname] = useState("");

    // ✅ 1. 토큰 가져오기 & 닉네임 추출
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setJwtToken(storedToken);
            extractNicknameFromToken(storedToken);
        }
        fetchChatHistory();
    }, []);

    // ✅ 2. jwtToken이 설정된 후 WebSocket 연결
    useEffect(() => {
        if (jwtToken) {
            connectWebSocket();
        }
        return () => disconnectWebSocket();
    }, [jwtToken]); // ✅ jwtToken이 변경된 후 실행

    const extractNicknameFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setNickname(payload.nickname);
        } catch (error) {
            console.error("JWT 디코딩 오류:", error);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chat/${univId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("채팅 기록 불러오기 오류:", error);
        }
    };

    const connectWebSocket = () => {
        if (!jwtToken) {
            return; // ✅ jwtToken이 없을 때 실행하지 않음
        }

        const socket = new SockJS(`${API_URL}/ws`);
        const stomp = Stomp.over(socket);

        stomp.connect(
            { Authorization: `Bearer ${jwtToken}` },
            () => {
                console.log(`✅ 대학 ${univId} 채팅방 연결 성공!`);
                setConnected(true);
                setStompClient(stomp);

                stomp.subscribe(`/topic/chat/${univId}`, (message) => {
                    setMessages((prev) => [...prev, JSON.parse(message.body)]);
                });
            },
            (error) => {
                console.error("🚨 WebSocket 연결 실패:", error);
                alert("WebSocket 연결 실패!");
            }
        );
    };

    const disconnectWebSocket = () => {
        if (stompClient) {
            stompClient.disconnect();
            setConnected(false);
            console.log(`🚪 대학 ${univId} 채팅방 연결 해제됨.`);
        }
    };

    const sendMessage = () => {
        if (stompClient && connected) {
            const chatMessage = {
                univId: univId,
                sender: nickname,
                content: message,
                timestamp: new Date().toISOString(),
            };

            stompClient.send(`/app/chat/${univId}`, {}, JSON.stringify(chatMessage));
            setMessage("");
        } else {
            alert("WebSocket에 연결되어 있지 않습니다.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>📢 {`대학 ${univId} 채팅방`}</h2>

            {/* ✅ 연결 성공 시 메시지 표시 */}
            {connected ? <p style={{ color: "green" }}>✅ 채팅방에 접속되었습니다!</p> : <p>🔌 WebSocket 연결 중...</p>}

            <div style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>✉️ 메시지 전송</button>
            </div>

            <h3>💬 채팅 메시지</h3>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content} <br />
                        <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatPage;
