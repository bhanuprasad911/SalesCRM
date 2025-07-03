import React from "react";
import style from "../styles/SidebarComponent.module.css";
import { useNavigate, useLocation } from "react-router";

function SidebarComponent({ path }) {
  const navigate = useNavigate();

  return (
    <div className={style.main}>
      <div className={style.title}>
        <p className={style.name}>
          Canova<span className={style.editedname}>CRM</span>
        </p>
      </div>
      <div className={style.links}>
        <button
          className={`${style.button} ${
            path === "/dashboard" ? style.selected : ""
          }`}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Dashboard
        </button>
        <button
          className={`${style.button} ${
            path === "/leads" ? style.selected : ""
          }`}
          onClick={() => navigate("/leads")}
        >
          Leads
        </button>
        <button
          className={`${style.button} ${
            path === "/employees" ? style.selected : ""
          }`}
          onClick={() => navigate("/employees")}
        >
          Employees
        </button>
        <button
          className={`${style.button} ${
            path === "/settings" ? style.selected : ""
          }`}
          onClick={() => navigate("/settings")}
        >
          Settings
        </button>
      </div>
    </div>
  );
}

export default SidebarComponent;
