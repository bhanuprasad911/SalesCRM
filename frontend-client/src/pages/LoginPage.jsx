import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/api.js"; 
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import style from '../styles/LoginPage.module.css'


const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await login(form);
      toast.success("Login successful!");
      setUser(res.data.data)
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
    setLoading(false)
  };

  return (
    <div className={style.main}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>{loading?"..." : "Login"}</button>
    </div>
  );
};

export default LoginPage;
