import React, { useState, useEffect } from 'react';
import style from '../styles/Leads.module.css';
import SearchComponent from '../components/SearchComponent.jsx';
import UploadLeadsComponent from '../components/UploadLeadsComponent.jsx';
import { getLeads } from '../services/api.js';
import { useSearchParams } from 'react-router';

function Leads({ select }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;

  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}



  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads(page);

        setLeads(response.data.data);
        setTotalPages(response.data.totalPages);
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, [page]);

  useEffect(() => {
    setSearchParams({ page });
  }, [page, setSearchParams]);

  return (
    <div className={style.main}>
      <SearchComponent />
      <div className={style.InnerMain}>
        <div className={style.header}>
          {` Home > ${select}`}
          <button className={style.addLeads} onClick={() => setShowForm(!showForm)}>
            Add leads
          </button>
          {showForm && <UploadLeadsComponent showForm={setShowForm} />}
        </div>

        <div className={style.table}>
          <div className={style.tableHead}>
            <button className={style.button}>no</button>
            <button className={style.button}>Name</button>
            <button className={style.button}>Date</button>
            <button className={style.button}>No.of leads</button>
            <button className={style.button}>Assigned leads</button>
            <button className={style.button}> Unassigned leads</button>
            <button className={style.button}>Closed leads</button>
          </div>

          <div className={style.tableBody}>
            {leads.length === 0 ? (
              <p>No leads available</p>
            ) : (
              leads.map((lead) => (
                
                <div className={style.tableRow} key={lead._id}>
                  <p className={style.id}>{lead._id}</p>
                  <p className={style.name}>{lead.name}</p>
                  <p className={style.email}>{formatDateToDDMMYYYY(lead.createdAt)}</p>
                  <p className={style.loc}>{lead.total}</p>
                  <p className={style.lan}>{lead.assigned}</p>
                  <p className={style.lan1}>{lead.unAssigned}</p>
                  <p className={style.lan2}>{lead.closed}</p>
                </div>
              ))
            )}
          </div>

        {/* ✅ Numbered Pagination */}
        {totalPages > 1 && (
          <div className={style.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`${style.pageButton} ${
                  page === index + 1 ? style.activePage : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
        </div>

      </div>
    </div>
  );
}

export default Leads;
