import { io } from "socket.io-client";

let socket = null;

export const connectWS = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;
