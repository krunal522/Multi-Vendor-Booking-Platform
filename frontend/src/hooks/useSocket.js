import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

let socketInstance = null;

export function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && !socketInstance) {
      const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, "") : "http://localhost:5000";
      socketInstance = io(socketUrl, { transports: ["websocket", "polling"] });
      socketRef.current = socketInstance;
    }
    if (user && socketInstance) {
      socketInstance.emit("join_room", user._id);
    }
    return () => {};
  }, [user]);

  return socketRef.current || socketInstance;
}
