import axiosInstance from "./axios.js";
import axios from "axios";

export const EmpSignup = async(data)=>{
    const response = await axiosInstance.post('/employee/signup', data)
    console.log(response)
    return response
}
export const getEmployees = async()=>{
    const response = await axiosInstance.get('/employee/')
    return response
}
export const deleteEmployee = async(id)=>{
    const response = await axiosInstance.delete(`/employee/${id}`)
    return response
}
export const getEmpDetailsWthID = async(id)=>{
    const res = await axiosInstance.get(`/employee/${id}`)
    return res
}