import React, { useState } from "react";
import style from "../styles/SearchComponent.module.css";
import { VscSettings } from "react-icons/vsc";
import { FaSearch } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";

function SearchComponent() {
  const [showFilter, setShowFilter] = useState(false);
  const [Filter, setFilter] = useState("All");
  const handleSave = () => {
    setShowFilter(false);
  };
  return (
    <div className={style.main}>
      <IoSearchSharp className={style.icon} size={28} />
      <input type="text" className={style.input} />

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
  );
}

export default SearchComponent;
