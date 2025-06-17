import React from 'react'
import style from '../styles/AddEmployee.module.css'
import { useState } from 'react';


function AddEmployee({setForm}) {
   const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];
const Languages = [
    "English",
    "Hindi",
    "Telugu",
    "Malayalam",
    "Urdu"
]
    const [formData, setFormData] = useState({
        firstName:'',
        lastName:'',
        email:'',
        location:'',
        prefLang:''
    })
const handleChange=(e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
}
const handleSave = ()=>{
    console.log(formData);
    setForm(false)
}

  return (
    <div className={style.main}>
        <div className={style.innerMain}>

      
        <div className={style.title}>
            <p>Add new employee</p>
            <button className={style.closeButton} onClick={()=>setForm(false)}>X</button>
        </div>
        <div className={style.form}>
            <label className={style.label}>First name</label><br /><br />
            < input name='firstName' className={style.input} value={formData.firstName} onChange={(e)=>handleChange(e)} type="text" /><br /><br /><br />
            <label className={style.label}>Last name</label><br /><br />
            < input name='lastName' className={style.input} value={formData.lastName} onChange={(e)=>handleChange(e)} type="text" /> <br /><br /><br />
            <label className={style.label}>Email</label><br /><br />
            < input name='email' className={style.input} value={formData.email} onChange={(e)=>handleChange(e)} type="text" /> <br /><br /><br />
            <label className={style.label}>Location</label> <br /><br />
            <select name='location' className={style.input} onChange={(e)=>handleChange(e)} value={formData.location}>
                <option value="">Select prefered location</option>
                {
                    indianStates.map((state, id)=>{
                        return <option key={id} value={state}>{state}</option>
                    })
                }
            </select><br /><br /><br />
            <label className={style.label}>Prefered language</label><br /><br />
            <select name='prefLang' className={style.input} onChange={(e)=>handleChange(e)} value={formData.prefLang}>
                <option value="">Select prefered language</option>
                {
                    Languages.map((lang, id)=>{
                        return <option key={id} value={lang}>{lang}</option>
                    })
                }
            </select><br /><br /><br /><br /><br />
            <div className={style.buttonDiv}>
                <button className={style.saveButton} onClick={handleSave}>Save</button>
            </div>
        </div>
          </div>
      
    </div>
  )
}

export default AddEmployee
