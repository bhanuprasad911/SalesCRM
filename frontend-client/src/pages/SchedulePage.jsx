import React, { useEffect, useState } from "react";
import style from "../styles/SchedulePage.module.css";
import SearchComponent from "../components/SearchComponent";
import { getLeadsAssigned } from "../services/api.js";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { IoSearchSharp } from "react-icons/io5";

function SchedulePage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [Filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const handleSave = () => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    if (Filter === "All") {
      setFilteredLeads(leads);
    } else if (Filter === "Today") {
      setFilteredLeads(
        leads.filter((lead) => {
          const leadDate = new Date(lead.NextAvailable);
          return leadDate >= startOfDay && leadDate <= endOfDay;
        })
      );
    }

    setShowFilter(false);
  };

  useEffect(() => {
    const getLeads = async () => {
      const response = await getLeadsAssigned();
      const notClosed = response.data.filter((lead) => lead.status !== "Closed");
      const sorted = notClosed.sort(
        (a, b) => new Date(a.NextAvailable) - new Date(b.NextAvailable)
      );
      setLeads(sorted);
      setFilteredLeads(sorted);
    };
    getLeads();
  }, []);

  function formatDateToLong(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  // 🔍 Function to filter based on search input across all fields
const searchedLeads = filteredLeads.filter((lead) => {
  const query = search.toLowerCase();

  return Object.entries(lead).some(([key, value]) => {
    // Search through all string fields
    if (typeof value === "string" && value.toLowerCase().includes(query)) {
      return true;
    }

    // Match dates (NextAvailable, createdAt, updatedAt) formatted to "Month Day, Year"
    if (
      ["NextAvailable", "createdAt", "updatedAt"].includes(key) &&
      typeof value === "string"
    ) {
      const formatted = new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).toLowerCase();
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
              value={Filter}
              onChange={(e) => setFilter(e.target.value)}
              className={style.select}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
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
          <p>No scheduled leads</p>
        ) : (
          searchedLeads.map((lead, index) => (
            <div className={style.lead} key={index}>
              <div className={style.top}>
                <div className={style.topLeft}>
                  <p className={style.source}>{lead.source}</p>
                  <p className={style.phone}>{lead.phone}</p>
                </div>
                <div className={style.topRight}>
                  <p>Date</p>
                  <p>{formatDateToLong(lead.NextAvailable)}</p>
                </div>
              </div>
              <div className={style.bottom}>
                <div className={style.innerBottom}>
                  <IoLocationOutline size={20} /> <p>Call</p>
                </div>
                <div className={style.innerBottom}>
                  <FaRegUserCircle size={20} />
                  <p>{lead.name}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SchedulePage;
