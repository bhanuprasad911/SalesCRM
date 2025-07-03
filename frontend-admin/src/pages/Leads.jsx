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
  const [searchText, setSearchText] = useState('');

  function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const fetchLeads = async () => {
    try {
      const response = await getLeads(page);
      setLeads(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  useEffect(() => {
    setSearchParams({ page });
  }, [page, setSearchParams]);

  // Filter leads based on search text (match any field)
  const filteredLeads = leads.filter((lead) => {
    const lowerSearch = searchText.toLowerCase();
    return Object.values(lead).some((value) =>
      String(value).toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className={style.main}>
      <SearchComponent text={searchText} setText={setSearchText} />

      <div className={style.InnerMain}>
        <div className={style.header}>
          {` Home > ${select}`}
          <button className={style.addLeads} onClick={() => setShowForm(!showForm)}>
            Add leads
          </button>
          {showForm && (
            <UploadLeadsComponent
              showForm={setShowForm}
              refreshLeads={fetchLeads} // Pass refresh function to child
            />
          )}
        </div>

        <div className={style.table}>
          <div className={style.tableHead}>
            <button className={style.button}>no</button>
            <button className={style.button}>Name</button>
            <button className={style.button}>Date</button>
            <button className={style.button}>No.of leads</button>
            <button className={style.button}>Assigned leads</button>
            <button className={style.button}>Unassigned leads</button>
            <button className={style.button}>Closed leads</button>
          </div>

          <div className={style.tableBody}>
            {filteredLeads.length === 0 ? (
              <p>No leads available</p>
            ) : (
              filteredLeads.map((lead, index) => (
                <div className={style.tableRow} key={lead._id}>
                  <p className={style.id}>{index + 1}</p>
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

          {totalPages > 1 && (
            <div className={style.pagination}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`${style.pageButton} ${page === index + 1 ? style.activePage : ''}`}
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
