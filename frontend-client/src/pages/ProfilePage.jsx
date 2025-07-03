import React, { useState } from "react";
import style from "../styles/ProfilePage.module.css";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { updatePassword } from "../services/api";

function ProfilePage() {
  const { user } = useAuth();
  const [formdata, setFormdata] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async () => {
    try {
      if (formdata.password.trim().length === 0)
        return toast.error("Password should not be empty");
      if (formdata.password.trim() != formdata.confirmPassword.trim())
        return toast.error("Password does not match confirm password");
      console.log(formdata);
      const data = {
        password: formdata.password,
      };
      const res = await updatePassword(data);
      console.log(res);
      toast.success(res.data.message);
      setFormdata({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  return (
    <div className={style.main}>
      <div className={style.div}>
        <label className={style.label}>First Name</label>
        <input
          type="text"
          value={user.firstName}
          className={style.input}
          readOnly
        />
      </div>
      <div className={style.div}>
        <label className={style.label}>Last Name</label>
        <input
          type="text"
          value={user.lastName}
          className={style.input}
          readOnly
        />
      </div>
      <div className={style.div}>
        <label className={style.label}>Email</label>
        <input
          type="text"
          value={user.email}
          className={style.input}
          readOnly
        />
      </div>
      <div className={style.div}>
        <label className={style.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formdata.password}
          className={style.input}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className={style.div}>
        <label className={style.label}>Confim password</label>
        <input
          type="password"
          value={formdata.confirmPassword}
          name="confirmPassword"
          className={style.input}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <button onClick={handleSubmit} className={style.button}>
        Save
      </button>
    </div>
  );
}

export default ProfilePage;
