import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

let socketInstance = null;

export function useSocket() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(socketInstance);

  useEffect(() => {
    if (!user) return;

    if (!socketInstance) {
      const socketUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/+$/, "")
        : "http://localhost:5000";
      socketInstance = io(socketUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 1000
      });
    }

    setSocket(socketInstance);

    const joinRoom = () => {
      if (user?._id) {
        socketInstance.emit("join_room", user._id);
      }
    };

    if (socketInstance.connected) {
      joinRoom();
    } else {
      socketInstance.on("connect", joinRoom);
    }

    return () => {
      socketInstance?.off("connect", joinRoom);
    };
  }, [user?._id]);

  return socket || socketInstance;
}
