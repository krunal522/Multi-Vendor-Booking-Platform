import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

let socketInstance = null;

export function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && !socketInstance) {
      socketInstance = io("http://localhost:5000", { transports: ["websocket"] });
      socketRef.current = socketInstance;
    }
    if (user && socketInstance) {
      socketInstance.emit("join_room", user._id);
    }
    return () => {};
  }, [user]);

  return socketRef.current || socketInstance;
}
