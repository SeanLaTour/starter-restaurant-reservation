import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
const axios = require("axios");

function Seat() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    async function loadTables() {
      const response = await fetch("/tables");
      const data = await response.json();
      setTables(data.data);
    }
    loadTables();
  }, []);

  // See if you can change this to a const
  let tableOptions = tables.map((table, index) => {
    return (
      <option key={index} id={table.table_id}>
        {table.table_name} -{table.capacity}
      </option>
    );
  });

  function handleButtonSubmit(e) {
    e.preventDefault();
    const element = document.getElementById("selector");
    const table_id = element.options[element.selectedIndex].id;
    const reservation_id = Number(params.reservation_Id);
    const data = {
      reservation_id,
    };
    axios
      .put(`/tables/${table_id}/seat`, { data })
      .then(() => {
        history.push("/dashboard");
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  }

  return (
    <div>
      <h1>Seat</h1>
      <form className="form">
        <label className="formItem">Table Number:</label>
        <select className="formItem" id="selector" name="table_id">
          {tableOptions}
        </select>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={(e) => {
              handleButtonSubmit(e);
            }}
            className="formItem"
          >
            Submit
          </button>
          <button className="formItem">
            <Link to="/dashboard">Cancel</Link>
          </button>
        </div>
        <div className="formItem">
          {error.length > 0 && <ErrorAlert error={error} />}
        </div>
      </form>
    </div>
  );
}

export default Seat;
