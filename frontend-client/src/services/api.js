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

export const getLeadsAssigned = async()=>{
  const res = await axiosInstance.get('/employee/getAssigned')
  return res
}
export const leadStatusUpdate = async(data)=>{
  const res = await axiosInstance.patch('/lead/updateStatus', data)
  return res
}
export const leadTypeUpdate = async(data)=>{
  const res = await axiosInstance.patch('/lead/updateType', data)
  return res
  }
  export const leadAvailableUpdate = async(data)=>{
    const res = await axiosInstance.patch(`/lead/updateAvailable/`, data)
    return res
    }