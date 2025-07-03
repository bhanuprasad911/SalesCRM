import React, { useState, useEffect } from "react";
import style from "../styles/Employees.module.css";
import SearchComponent from "../components/SearchComponent.jsx";
import AddEmployee from "../components/AddEmployee.jsx";
import EmployeeComponent from "../components/EmployeeComponent.jsx";
import { getEmployees, deleteEmployee } from "../services/api.js";
import { useSearchParams } from "react-router";

function Employees({ select }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(""); // ✅
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [sort, setSort] = useState({ field: "", direction: "asc" });
  const [sorted, setSorted] = useState([]);
  const [edit, setEdit] = useState("");
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data.data);
        setSorted(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    setSorted(employees);
  }, [employees]);

  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage, setSearchParams]);

  // ✅ Sorting
  useEffect(() => {
    let sortedData = [...employees];

    if (sort.field) {
      sortedData.sort((a, b) => {
        let aVal = a[sort.field] ?? "";
        let bVal = b[sort.field] ?? "";

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setSorted(sortedData);
  }, [sort, employees]);

  // ✅ Filter sorted employees using search text
  // ✅ Filter sorted employees by selected fields only
  const filtered = sorted.filter((emp) => {
    const lowerSearch = search.toLowerCase();
    const fullname = `${emp.firstName} ${emp.lastName}`;

    const fieldsToCheck = [
      emp._id,
      fullname,
      emp.email,
      emp.status,
      emp.assignedChats?.length,
      emp.closedChats?.length,
    ];

    return fieldsToCheck.some((field) =>
      String(field).toLowerCase().includes(lowerSearch)
    );
  });

  // ✅ Pagination after filtering
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  useEffect(() => {
    const total = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > total) {
      setCurrentPage(Math.max(1, total));
    }
  }, [filtered, currentPage]);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

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

      {/* ✅ Search with props */}
      <SearchComponent text={search} setText={setSearch} />

      <div className={style.innermain}>
        <div className={style.title}>
          <p>{` Home > ${select}`}</p>
          <button onClick={() => setShowForm(true)} className={style.button1}>
            Add employee
          </button>
        </div>

        <div className={style.body}>
          <div className={style.tableHead}>
            <button
              className={`${style.button} ${style.name}`}
              onClick={() => handleSort("firstName")}
            >
              Name{" "}
              {sort.field === "firstName"
                ? sort.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </button>
            <button className={style.button} onClick={() => handleSort("_id")}>
              Employee ID{" "}
              {sort.field === "_id"
                ? sort.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </button>
            <button
              className={style.button}
              onClick={() => handleSort("assignedChats")}
            >
              Assigned Leads{" "}
              {sort.field === "assignedChats"
                ? sort.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </button>
            <button
              className={style.button}
              onClick={() => handleSort("closedChats")}
            >
              Closed Leads{" "}
              {sort.field === "closedChats"
                ? sort.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </button>
            <button
              className={style.button}
              onClick={() => handleSort("status")}
            >
              Status{" "}
              {sort.field === "status"
                ? sort.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </button>
            <button className={`${style.button} ${style.options}`}>
              Options
            </button>
          </div>

          {currentEmployees.length === 0 ? (
            <p className={style.noResults}>No employees found</p>
          ) : (
            currentEmployees.map((emp) => (
              <EmployeeComponent
                key={emp._id}
                employee={emp}
                employees={sorted}
                setEdit={setEdit}
                setEmployee={setEmployees}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* ✅ Pagination */}
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
