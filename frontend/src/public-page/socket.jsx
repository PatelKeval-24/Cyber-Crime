import { io } from "socket.io-client";

// Use your AWS URL here if deployed, otherwise localhost
const URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}`; // Use environment variable for backend URL

export const socket = io(URL, {
    withCredentials: true,
    autoConnect: true, // Connects as soon as the app loads
});