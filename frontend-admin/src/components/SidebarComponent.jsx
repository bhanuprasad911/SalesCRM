import React from 'react'
import style from '../styles/SidebarComponent.module.css'

function SidebarComponent({select, selected}) {
  return (
    <div className={style.main}> 
    <div className={style.title}>
        <p className={style.name}>Canova<span className={style.editedname}>CRM</span></p>
    </div>
    <div className={style.links}>
        <button className={`${style.button} ${selected==="Dashboard"?style.selected:""}`} onClick={()=>{select('Dashboard')}} >Dashboard</button>
        <button className={`${style.button} ${selected==="Leads"?style.selected:""}`} onClick={()=>select('Leads')}>Leads</button>
        <button className={`${style.button} ${selected==="Employees"?style.selected:""}`} onClick={()=>select('Employees')}>Employees</button>
        <button className={`${style.button} ${selected==="Settings"?style.selected:""}`} onClick={()=>select('Settings')}>Settings</button>
    </div>
      
    </div>
  )
}

export default SidebarComponent
