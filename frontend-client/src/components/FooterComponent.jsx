import React from 'react'
import style from '../styles/FooterComponent.module.css'
import { FaUserTag, FaHome, FaRegUserCircle } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useNavigate } from 'react-router';

function FooterComponent({select, setSelect}) {
    const navigate = useNavigate()
  return (
    <div className={style.main}>
        <div className={`${style.section} ${select==='Home'?style.selected:""}`} onClick={()=>navigate("/home")}>
            <FaHome size={30}/>
            <p>Home</p>
        </div>
        <div className={`${style.section} ${select==='Leads'?style.selected:""}`} onClick={()=>navigate("/leads")}>
            <FaUserTag size={30}/>
            <p>Leads</p>

        </div>
        <div className={`${style.section} ${select==='Schedule'?style.selected:""}`} onClick={()=>navigate("/schedule")} >
            <SlCalender size={30}/>
            <p>Schedule</p>
        </div>
        <div className={`${style.section} ${select==='Profile'?style.selected:""}`} onClick={()=>navigate("/profile")}>
            <FaRegUserCircle size={30}/>
            <p>Profile</p>
        </div>
      
    </div>
  )
}

export default FooterComponent
