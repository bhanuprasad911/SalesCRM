import React, { useState } from "react";
import SearchComponent from "../components/SearchComponent.jsx";
import style from "../styles/Settings.module.css";
import { useAuth } from "../context/AuthContext.jsx";
import { updateAdminPassword } from "../services/api.js";
import toast from "react-hot-toast";

function Settings({ select }) {
  const { admin } = useAuth();
  const [formdata, setFormdata] = useState({
    password: "",
    confirmPassword: "",
  });
  console.log(admin);
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const updatePassword = async () => {
    try {
      if (
        formdata.password.trim().length === 0 ||
        formdata.confirmPassword.trim().length === 0
      ) {
        toast.error("Password should not be empty");
        return;
      }
      if (formdata.password.trim() !== formdata.confirmPassword.trim()) {
        toast.error("Password and Confirm Password should be same");
        return;
      }
      const res = await updateAdminPassword(formdata);
      toast.success("Password updated successfully");
      setFormdata({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className={style.main}>
      <SearchComponent />
      <div className={style.innerMain}>
        <div className={style.title}>
          <p>{` Home > ${select}`}</p>
        </div>
        <div>
          <div className={style.profile}>
            <p>Edit profile</p>
          </div>
          <div className={style.form}>
            <label className={style.label}>First name</label>
            <br />
            <input
              value={admin.firstName}
              readOnly
              className={style.input}
              type="text"
            />
            <br />
            <br />
            <label className={style.label}>Last name</label>
            <br />
            <input
              value={admin.lastName}
              readOnly
              className={style.input}
              type="text"
            />
            <br />
            <br />
            <label className={style.label}> Email</label>
            <br />
            <input
              value={admin.email}
              readOnly
              className={style.input}
              type="text"
            />
            <br />
            <br />
            <label className={style.label}>Password</label>
            <br />
            <input
              onChange={(e) => {
                handleChange(e);
              }}
              name="password"
              value={formdata.password}
              className={style.input}
              type="password"
            />
            <br />
            <br />
            <label className={style.label}>Confirm password</label>
            <br />
            <input
              name="confirmPassword"
              value={formdata.confirmPassword}
              onChange={(e) => handleChange(e)}
              className={style.input}
              type="password"
            />
            <br />
            <br />
            <br />
            <button onClick={updatePassword} className={style.saveButton}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
