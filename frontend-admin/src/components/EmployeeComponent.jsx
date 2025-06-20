import React from "react";
import style from "../styles/EmployeeComponent.module.css";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { MdOutlineEdit, MdDelete } from "react-icons/md";
import {deleteEmployee} from '../services/api.js'
import {toast} from 'react-hot-toast'

function EmployeeComponent(props) {
    const [showEdit, setShowEdit] = useState(false)
    const deleteEmp = async ()=>{
      try {
        const res =await deleteEmployee(props.employee._id)
        console.log(res)
        toast.success(res.data.message)
        const updated = props.employees?.filter((emp)=>{
          return emp._id!= props.employee._id
        })
        props.setEmployee(updated)
        setShowEdit(false)
        
      } catch (error) {
        console.log(error)
        toast.error(error.data.message)
        
      }
    }
    
  return (
    <div className={style.main}>
      <div className={style.profile}>
        {props.employee.firstName[0].toUpperCase()+props.employee.lastName[0].toUpperCase()}
      </div>
      <div className={style.name}>
        <p className={style.nameText}>{`${props.employee.firstName} ${props.employee.lastName}`}</p>
        <p className={style.mailText}>{props.employee.email}</p>
      </div>
      <p className={style.id}>{props.employee._id}</p>
      <p className={style.assigned}>{props.employee.assignedChats}</p>
      <p className={style.closed}>{props.employee.closedChats}</p>
      <div className={`${style.status} ${props.employee.status==='Active'?style.activeDiv:style.inactiveDiv}`}>
        <div className={`${style.circle} ${props.employee.status==='Inactive'?style.inactive:style.active}`}></div>
        <p className={`${style.p} ${props.employee.status==="Active"?style.activeP:style.inactiveP}`}>

        {props.employee.status}
        </p>

      </div>
      <button className={style.options} onClick={()=>setShowEdit(!showEdit)}>
        <SlOptionsVertical color="black" size={20} />
      </button>
      {
        showEdit&&<div className={style.edit}>
            <button className={style.button} onClick={()=>{setShowEdit(false);props.setEdit(props.employee._id)}}>
                <span className={style.tagStyle}>
                <MdOutlineEdit color="black" />

                </span>
                Edit
                </button>
            <button className={style.button} onClick={deleteEmp}>
                <span className={style.tagStyle}>
                    <MdDelete color="black" />
                </span>
                Delete
            </button>
        </div>
      }
    </div>
  );
}

export default EmployeeComponent;
