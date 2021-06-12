import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
const axios = require("axios");

function NewReservation() {
  const history = useHistory();
  const [error, setError] = useState("");

  function handleButtonSubmit(e) {
    e.preventDefault();
    const first_name = document.getElementById("first").value;
    const last_name = document.getElementById("last").value;
    const mobile_number = document.getElementById("mobile").value;
    const reservation_date = document.getElementById("date").value;
    const reservation_time = document.getElementById("time").value;
    let people = document.getElementById("people").value;
    people = Number(people);
    const status = "booked";
    const data = {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    };
    axios
      .post("http://localhost:5000/reservations", { data })
      .then(() => {
        history.push("/dashboard");
      })
      .catch((err) => {
        setError(err.response.data.error);
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
          <label name="first_name">First Name</label>
          <input id="first" placeholder="John" name="first_name" />
        </div>
        <div className="formItem">
          <label name="last_name">Last Name</label>
          <input id="last" placeholder="Doe" name="last_name" />
        </div>
        <div className="formItem">
          <label name="mobile_number">Mobile Number</label>
          <input
            id="mobile"
            placeholder="(XXX)-XXX-XXXX"
            name="mobile_number"
          />
        </div>
        <div className="formItem">
          <label name="reservation_date">Reservation Date</label>
          <input
            id="date"
            placeholder="YYYY-MM-DD"
            type="date"
            name="reservation_date"
          />
        </div>
        <div className="formItem">
          <label name="reservation_time">Reservation Time</label>
          <input
            id="time"
            placeholder="HH:MM:SS"
            type="time"
            name="reservation_time"
          />
        </div>
        <div className="formItem">
          <label name="people">People</label>
          <input
            id="people"
            type="number"
            placeholder="Total party size"
            name="people"
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

export default NewReservation;
