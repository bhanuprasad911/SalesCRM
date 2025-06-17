import React from 'react'
import style from '../styles/FooterComponent.module.css'
import { FaUserTag, FaHome, FaRegUserCircle } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

function FooterComponent({select, setSelect}) {
  return (
    <div className={style.main}>
        <div className={`${style.section} ${select==='home'?style.selected:""}`} onClick={()=>setSelect('home')}>
            <FaHome size={30}/>
            <p>Home</p>
        </div>
        <div className={`${style.section} ${select==='leads'?style.selected:""}`} onClick={()=>setSelect('leads')}>
            <FaUserTag size={30}/>
            <p>Leads</p>

        </div>
        <div className={`${style.section} ${select==='schedule'?style.selected:""}`} onClick={()=>setSelect('schedule')}>
            <SlCalender size={30}/>
            <p>Schedule</p>
        </div>
        <div className={`${style.section} ${select==='profile'?style.selected:""}`} onClick={()=>setSelect('profile')}>
            <FaRegUserCircle size={30}/>
            <p>Profile</p>
        </div>
      
    </div>
  )
}

export default FooterComponent
