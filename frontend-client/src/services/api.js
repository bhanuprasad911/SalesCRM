import axios from "axios";
import axiosInstance from "./axios.js";

export const login = async(data)=>{
    const res = await axiosInstance.post('/employee/login',data)
    return res
}

export const fetchCurrentUser = async () => {
  const res = await axiosInstance.get('/employee/me');
  return res.data;
};

export const updateCheck = async(data)=>{
  const res = await axiosInstance.patch("employee/updateStatus", data)
  return res
}

export const updatePassword = async(data)=>{
  const res = await axiosInstance.post('employee/updatePassword', data)
  return res
}