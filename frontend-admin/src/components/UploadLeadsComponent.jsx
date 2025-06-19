import React from 'react'
import style from '../styles/UpploadLeads.module.css'
import FileUploader from './FileUploader'

function UploadLeadsComponent({showForm}) {
  return (
    <div className={style.main}>
        <div className={style.innerMain}>
            <div className={style.header}>
                <div className={style.left}>
                      <h2>CSV Upload</h2>
                <p>Add your documents here</p>
                </div>
                <button className={style.close} onClick={()=>showForm(false)}>X</button>
              
            </div>
            <div className={style.body}>
                <FileUploader />
            </div>
            <div className={style.buttons}>
                <button className={style.save}>Save</button>
                <button className={style.cancel}>Cancel</button>
            </div>
        </div>
      
    </div>
  )
}

export default UploadLeadsComponent
