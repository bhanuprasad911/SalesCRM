import React, { useEffect, useState } from 'react'
import style from '../styles/LeadsPage.module.css'
import SearchComponent from '../components/SearchComponent'
import { getLeadsAssigned } from '../services/api.js';
import LeadsComponent from '../components/LeadsComponent.jsx';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  useEffect(()=>{
    const getLeads = async()=>{
      const response = await getLeadsAssigned()
      setLeads(response.data)
      console.log(response)
    }
    getLeads()
  }, [])
  return (
    <div className={style.main}>
        <SearchComponent />
        <div className={style.body}>
           {
          leads.length===0?<>
          <p>No leads assigned</p>
          </>:<>
          {
            leads.map((lead, index)=>{
              return <LeadsComponent key={index} lead={lead} leads={leads} setLeads={setLeads}/>
              })
          }
          </>
        }

        </div>
       
      
    </div>
  )
}

export default LeadsPage
