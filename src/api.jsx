import axios from 'axios';

const api = axios.create({
    baseURL: "http://192.168.20.70:4435/Mixing",
});

export default api;
