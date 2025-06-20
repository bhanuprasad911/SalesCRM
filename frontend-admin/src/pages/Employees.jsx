import React, { useState, useEffect } from "react";
import style from "../styles/Employees.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import AddEmployee from "../components/AddEmployee.jsx";
import { getEmployees } from "../services/api.js";
import EmployeeComponent from "../components/EmployeeComponent.jsx";


function Employees({ select }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [sort, setSort] = useState({ field: "", direction: "asc" });
  const [sorted, setSorted] = useState([]);
  const [edit, setEdit] = useState("");
  

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const empDetails = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data.data);
        setSorted(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    empDetails();
  }, []);

  // ✅ Sync sorted with employees
  useEffect(() => {
    setSorted(employees);
  }, [employees]);

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const handleSort = (field) => {
  setSort((prev) => {
    if (prev.field === field) {
      // Toggle direction
      return {
        field,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    } else {
      // New field, default to ascending
      return { field, direction: "asc" };
    }
  });
};


 useEffect(() => {
  let sortedData = [...employees];

  if (sort.field) {
    sortedData.sort((a, b) => {
      let aVal = a[sort.field] ?? "";
      let bVal = b[sort.field] ?? "";

      // Convert to lowercase for string sorting
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  setSorted(sortedData);
}, [sort, employees]);


  return (
    <div className={style.main}>
      {(showForm || edit.trim().length > 0) && (
        <AddEmployee
          setForm={setShowForm}
          edit={edit}
          setEdit={setEdit}
          setEmployees={setEmployees}
        />
      )}

      <SearchComponent />

      <div className={style.innermain}>
        <div className={style.title}>
          <p>{` Home > ${select}`}</p>
          <button onClick={() => setShowForm(true)} className={style.button1}>
            Add employee
          </button>
        </div>

        <div className={style.body}>
          <div className={style.tableHead}>
  <button className={`${style.button} ${style.name}`} onClick={() => handleSort("firstName")}>
    Name {sort.field === "firstName" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
  </button>
  <button className={style.button} onClick={() => handleSort("_id")}>
    Employee id {sort.field === "_id" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
  </button>
  <button className={style.button} onClick={() => handleSort("assignedChats")}>
    Assigned Leads {sort.field === "assignedChats" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
  </button>
  <button className={style.button} onClick={() => handleSort("closedChats")}>
    Closed Leads {sort.field === "closedChats" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
  </button>
  <button className={style.button} onClick={() => handleSort("status")}>
    Status {sort.field === "status" ? (sort.direction === "asc" ? "↑" : "↓") : ""}
  </button>
  <button className={`${style.button} ${style.options}`}>Options</button>
</div>



          {/* ✅ Paginated employee list */}
          {currentEmployees.map((emp) => (
            <EmployeeComponent
              key={emp._id}
              employee={emp}
              employees={sorted}
              setEdit={setEdit}
              setEmployee={setEmployees}
            />
          ))}
        </div>

        {/* ✅ Pagination Buttons */}
        {totalPages > 1 && (
          <div className={style.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`${style.pageButton} ${
                  currentPage === index + 1 ? style.activePage : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Employees;
