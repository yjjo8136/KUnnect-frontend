import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMessage, disconnectWebSocket } from "../services/chatService";

const ChatRoom = ({ univId, user }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
        connectWebSocket(univId, (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            disconnectWebSocket();
        };
    }, [univId]);

    const handleSendMessage = () => {
        if (messageInput.trim() !== "") {
            const message = {
                sender: user.nickname,
                content: messageInput,
                timestamp: new Date().toISOString(),
            };

            sendMessage(message);
            setMessages((prevMessages) => [...prevMessages, message]);
            setMessageInput("");
        }
    };

    return (
        <div className="chat-container">
            <h2>대학 채팅방</h2>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.sender}:</strong> {msg.content} <span className="time">({new Date(msg.timestamp).toLocaleTimeString()})</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChatRoom;
