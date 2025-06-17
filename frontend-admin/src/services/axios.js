import axios from 'axios'
const url = import.meta.env.VITE_BACKEND_URL
const backendUrl = import.meta.env.MODE === 'development'?url:'/api'

const axiosInstance = axios.create({
    baseURL:backendUrl,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"

    },
    withCredentials:true
})
export default axiosInstance