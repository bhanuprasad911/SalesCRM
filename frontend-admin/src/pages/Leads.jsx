import React from 'react'
import style from '../styles/Leads.module.css'
import SearchComponent from '../components/SearchComponent.jsx'
import { useState } from 'react'
import UploadLeadsComponent from '../components/UploadLeadsComponent.jsx'

function Leads({select}) {
  const [showForm, setShowForm] = useState(false)
  return (
    <div className={style.main}>
        <SearchComponent />
        <div className={style.InnerMain}>
          <div className={style.header}>
        { ` Home > ${select}`}
        <button className={style.addLeads} onClick={()=>setShowForm(!showForm)}>Add leads</button>
        {
          showForm && (
            <UploadLeadsComponent showForm={setShowForm}/> 
          )
        }

          </div>
        </div>
        
      
    </div>
  )
}

export default Leads
