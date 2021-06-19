import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
const axios = require("axios");

function NewTable() {
  const [error, setError] = useState("");
  const history = useHistory();
  const abortController = new AbortController();

  function handleButtonSubmit(e) {
    const table_name = document.getElementById("name").value;
    const capacity = document.getElementById("capacity").value;
    const data = {
      table_name,
      capacity,
    };
    axios
      .post("/tables", { data })
      .then(() => {
        history.push("/dashboard");
      })
      .catch((err) => {
        setError(err.response.data.error);
        abortController.abort();
      });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form className="form">
        <div className="formItem">
          <label name="table_name">Table Name</label>
          <input id="name" placeholder="Table Name" name="name" />
        </div>
        <div className="formItem">
          <label name="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            placeholder="Capacity"
            name="capacity"
          />
        </div>
        <div className="formItem">
          <button
            className="tButton"
            onClick={(e) => handleButtonSubmit(e)}
            type="submit"
          >
            Submit
          </button>
          <button className="tButton" name="cancel">
            <Link to="/">Cancel</Link>
          </button>
        </div>
        <div className="formItem">
          {error.length > 0 && <ErrorAlert error={error} />}
        </div>
      </form>
    </div>
  );
}

export default NewTable;
