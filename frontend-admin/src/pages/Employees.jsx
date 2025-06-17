import React from "react";
import style from "../styles/Employees.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import { useState } from "react";
import AddEmployee from "../components/AddEmployee.jsx";

function Employees({ select }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  return (
    <div className={style.main}>
      {
        showForm&&<AddEmployee setForm={setShowForm}/>
      }

      <SearchComponent />
      <div className={style.title}>
        <p>{` Home > ${select}`}</p>
        <button onClick={()=>setShowForm(true)} className={style.button}>Add employee</button>
      </div>
      <div></div>
    </div>
  );
}

export default Employees;
