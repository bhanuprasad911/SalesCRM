import React, { useEffect, useState } from "react";
import style from "../styles/LeadsPage.module.css";
import { getLeadsAssigned } from "../services/api.js";
import LeadsComponent from "../components/LeadsComponent.jsx";
import { VscSettings } from "react-icons/vsc";
import { IoSearchSharp } from "react-icons/io5";

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    const response = await getLeadsAssigned();
    setLeads(response.data);
    setFilteredLeads(response.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSave = () => {
    if (filter === "Open") {
      const openLeads = leads.filter((lead) => lead.status === "Open");
      setFilteredLeads(openLeads);
    } else if (filter === "Closed") {
      const closedLeads = leads.filter((lead) => lead.status === "Closed");
      setFilteredLeads(closedLeads);
    } else {
      setFilteredLeads(leads);
    }

    setShowFilter(false);
  };

  const searchedLeads = filteredLeads.filter((lead) => {
    const query = search.toLowerCase();

    return Object.entries(lead).some(([key, value]) => {
      if (typeof value === "string" && value.toLowerCase().includes(query))
        return true;

      if (
        ["NextAvailable", "createdAt", "updatedAt"].includes(key) &&
        typeof value === "string"
      ) {
        const formatted = new Date(value)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toLowerCase();
        return formatted.includes(query);
      }

      return false;
    });
  });

  return (
    <div className={style.main}>
      <div className={style.Searchmain}>
        <IoSearchSharp className={style.icon} size={28} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className={style.input}
          placeholder="Search anything..."
        />
        <button
          className={style.button}
          onClick={() => setShowFilter(!showFilter)}
        >
          <VscSettings color="black" size={30} />
        </button>
        {showFilter && (
          <div className={style.filter}>
            <p className={style.title}>Filter</p>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={style.select}
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            <br />
            <br />
            <button className={style.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>

      <div className={style.body}>
        {searchedLeads.length === 0 ? (
          <p>No leads found</p>
        ) : (
          searchedLeads.map((lead) => (
            <LeadsComponent
              key={lead._id}
              lead={lead}
              leads={leads}
              setLeads={setLeads}
              refreshLeads={fetchLeads}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default LeadsPage;
