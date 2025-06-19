import React from "react";
import style from "../styles/Employees.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import { useState } from "react";
import AddEmployee from "../components/AddEmployee.jsx";
import { useEffect } from "react";
import { getEmployees } from "../services/api.js";
import EmployeeComponent from "../components/EmployeeComponent.jsx";

function Employees({ select }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [sort, setSort] = useState("")
  const [sorted, setSorted] =useState([])
  const [edit, setEdit] = useState('')



  useEffect(() => {
    const empDetails = async () => {
      try {
        const res = await getEmployees();
        console.log(res);
        setEmployees(res.data.data);
        setSorted(res.data.data)
      } catch (error) {
        console.log(error);
      }
    };
    empDetails();
  }, []);

  return (
    <div className={style.main}>
      {(showForm || edit.trim().length>0) && <AddEmployee setForm={setShowForm} edit={edit} setEdit={setEdit}/>}

      <SearchComponent />
      <div className={style.innermain}>
        <div className={style.title}>
          <p>{` Home > ${select}`}</p>
          <button onClick={() => setShowForm(true)} className={style.button1}>
            Add employee
          </button>
        </div>
        <div className={style.body}>
          <div className={style.tableHead}>
            <button className={`${style.button} ${style.name}`}>Name</button>
            <button className={style.button}>Employee id</button>
            <button className={style.button}>Assigned Leads</button>
            <button className={style.button}>Closed leads</button>
            <button className={style.button}>Status</button>
            <button className={style.button}>Options</button>
          </div>
          {sorted.map((emp, index) => (
            <EmployeeComponent key={index} employee={emp} setEdit={setEdit}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Employees;
