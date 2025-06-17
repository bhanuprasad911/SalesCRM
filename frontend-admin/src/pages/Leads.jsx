import React from 'react'
import style from '../styles/Leads.module.css'
import SearchComponent from '../components/SearchComponent.jsx'

function Leads({select}) {
  return (
    <div className={style.main}>
        <SearchComponent />
        { ` Home > ${select}`}
      
    </div>
  )
}

export default Leads
