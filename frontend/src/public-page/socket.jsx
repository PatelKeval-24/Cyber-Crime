import { io } from "socket.io-client";

// Use your AWS URL here if deployed, otherwise localhost
const URL = "http://localhost:3000"; 

export const socket = io(URL, {
    withCredentials: true,
    autoConnect: true, // Connects as soon as the app loads
});