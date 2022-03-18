import { io } from "socket.io-client";

const serverUrl = 'http://localhost:8080';
export const socket = io(serverUrl);