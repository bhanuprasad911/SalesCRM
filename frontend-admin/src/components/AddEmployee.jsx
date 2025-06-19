import React, { useState, useEffect } from "react";
import style from "../styles/AddEmployee.module.css";
import { EmpSignup, getEmpDetailsWthID } from "../services/api.js";
import { toast } from "react-hot-toast";

function AddEmployee(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    language: "",
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const Languages = ["English", "Hindi", "Telugu", "Malayalam", "Urdu"];

  useEffect(() => {
    const getEmployee = async () => {
      if (props.edit.trim().length === 0) return;
      const res = await getEmpDetailsWthID(props.edit);
      setCurrentUser(res.data.data);
      setFormData(res.data.data); // populate formData on edit
    };
    getEmployee();
  }, [props.edit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log(formData)
    // if (currentUser) {
    //   toast.error("You're editing an employee. Updating is not supported here.");
    //   return;
    // }

    // try {
    //   await EmpSignup(formData);
    //   toast.success("Employee added successfully");
    //   props.setForm(false);
    //   props.setEdit("");
    // } catch (error) {
    //   console.error(error);
    //   toast.error(error?.response?.data?.message || "Error adding employee");
    // }
  };

  return (
    <div className={style.main}>
      <div className={style.innerMain}>
        <div className={style.title}>
          <p>{currentUser ? "Employee Details" : "Add New Employee"}</p>
          <button
            className={style.closeButton}
            onClick={() => {
              props.setForm(false);
              props.setEdit("");
            }}
          >
            X
          </button>
        </div>

        <div className={style.form}>
          <label className={style.label}>First name</label>
          <br /><br />
          <input
            name="firstName"
            className={style.input}
            value={formData.firstName}
            onChange={handleChange}
            type="text"
            // readOnly={Boolean(currentUser)}
          />
          <br /><br /><br />

          <label className={style.label}>Last name</label>
          <br /><br />
          <input
            name="lastName"
            className={style.input}
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            // readOnly={Boolean(currentUser)}
          />
          <br /><br /><br />

          <label className={style.label}>Email</label>
          <br /><br />
          <input
            name="email"
            className={style.input}
            value={formData.email}
            onChange={handleChange}
            type="email"
            readOnly={Boolean(currentUser)}
          />
          <br /><br /><br />

          <label className={style.label}>Location</label>
          <br /><br />
          <select
            name="location"
            className={style.input}
            value={formData.location}
            onChange={handleChange}
            disabled={Boolean(currentUser)}
          >
            <option value="">Select preferred location</option>
            {indianStates.map((state, id) => (
              <option key={id} value={state}>{state}</option>
            ))}
          </select>
          <br /><br /><br />

          <label className={style.label}>Preferred language</label>
          <br /><br />
          <select
            name="language"
            className={style.input}
            value={formData.language}
            onChange={handleChange}
            disabled={Boolean(currentUser)}
          >
            <option value="">Select preferred language</option>
            {Languages.map((lang, id) => (
              <option key={id} value={lang}>{lang}</option>
            ))}
          </select>
          <br /><br /><br /><br /><br />

        
            <div className={style.buttonDiv}>
              <button className={style.saveButton} onClick={handleSave}>
                Save
              </button>
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
