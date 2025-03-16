const CHAT_URL = process.env.REACT_APP_CHAT_URL;

let socket = null;

export const connectWebSocket = (univId, onMessageReceived) => {
    socket = new WebSocket(`${CHAT_URL}/chat/${univId}`); // 백엔드 WebSocket 엔드포인트

    socket.onopen = () => {
        console.log(`Connected to chat room for university ID ${univId}`);
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onMessageReceived(message);
    };

    socket.onclose = () => {
        console.log(`Disconnected from chat room for university ID ${univId}`);
    };
};

export const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
};

export const disconnectWebSocket = () => {
    if (socket) {
        socket.close();
    }
};
