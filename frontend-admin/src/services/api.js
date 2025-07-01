import axiosInstance from "./axios.js";


//lead related functions
export const uploadTempFile = async (formData, onProgress) => {
  try {
    const res = await axiosInstance.post("lead/upload-temp", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setTimeout(()=>onProgress(percent), 200)
         // callback from component
      },
    });
    return res.data;
  } catch (error) {
    console.error("uploadTempFile error:", error);
    throw error;
  }
};
export const cancelTempUpload = async (tempId) => {
  try {
    const res = await axiosInstance.post("lead/cancel-upload", { tempId });
    return res.data;
  } catch (error) {
    console.error("Cancel upload failed:", error);
    throw error;
  }
};
export const saveLeadsToDB = async (tempId, fileName) => {
  try {
    const response = await axiosInstance.post("/lead/save-to-db", {
      tempId,
      fileName,
    });
    return response.data; // contains message
  } catch (error) {
    console.error("saveLeadsToDB error:", error);
    throw error;
  }
};
export const getLeads = async (page = 1, limit = 10) => {
  return await axiosInstance.get(`/lead?page=${page}&limit=${limit}`);
};




// Employee related functions
export const EmpSignup = async (data) => {
  const response = await axiosInstance.post("/employee/signup", data);
  console.log(response);
  return response;
};
export const getEmployees = async (page = 1, limit = 10) => {
  return await axiosInstance.get(`/employee?page=${page}&limit=${limit}`);
};

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/employee/${id}`);
  return response;
};
export const getEmpDetailsWthID = async (id) => {
  const res = await axiosInstance.get(`/employee/${id}`);
  return res;
};
export const updateEmp = async (data) => {
  const response = await axiosInstance.patch("/employee", data);
  return response;
};



export const adminSignup=async(data)=>{
  const response=await axiosInstance.post("/admin/signup",data);
  return response;

}

export const adminLogin=async(data)=>{
  const response=await axiosInstance.post("/admin/login",data);
  return response;
  }
  export const getAdminDetails=async()=>{
    const response=await axiosInstance.get("/admin/me");
    return response;
    }
export const updateAdminPassword = async(data)=>{
  const response=await axiosInstance.patch("/admin/updatePassword",data);
  return response;
}
