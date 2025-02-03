import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://8a1b-36-78-38-21.ngrok-free.app",
    timeout: 5000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

export default axiosInstance;