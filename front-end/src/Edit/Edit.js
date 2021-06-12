import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
const axios = require("axios");

// Okay, so you're basically just going to copy and paste the origional form from "NewReservation"
// here and propogate it with the information that already exists from the back-end. Add
// Submit and Cancel buttons:
// Only reservations with a status of "booked" can be edited.
// Clicking the "Submit" button will save the reservation, then displays the previous page.
// Clicking "Cancel" makes no changes, then display the previous page.
// USE ON CHANGE HANDLER

function Edit() {
  const history = useHistory();
  const [error, setError] = useState("");
  const params = useParams();
  const [form, setForm] = useState({});

  useEffect(() => {
    async function loadTables() {
      const response = await fetch(
        `http://localhost:5000/reservations/${params.reservation_id}`
      );
      const data = await response.json();
      setForm(data.data);
    }
    loadTables();
  }, [params.reservation_id]);

  function handleButtonSubmit(e) {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/reservations/${params.reservation_id}`, {
        data: form,
      })
      .then(() => {
        history.push("/dashboard");
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  }

  function handleInput(e) {
    const name = e.target.name;
    if (name === "people") {
      const people = Number(e.target.value)
      setForm((state) => {
        return {
          ...state,
          [name]: people,
        };
      });
    } else {
      setForm((state) => {
        return {
          ...state,
          [name]: e.target.value,
        };
      });
    }
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
          <input
            id="first"
            placeholder="John"
            name="first_name"
            onChange={(e) => handleInput(e)}
            defaultValue={form.first_name}
          ></input>
        </div>
        <div className="formItem">
          <label name="last_name">Last Name</label>
          <input
            id="last"
            placeholder="Doe"
            name="last_name"
            onChange={(e) => handleInput(e)}
            defaultValue={form.last_name}
          />
        </div>
        <div className="formItem">
          <label name="mobile_number">Mobile Number</label>
          <input
            id="mobile"
            name="mobile_number"
            onChange={(e) => handleInput(e)}
            defaultValue={form.mobile_number}
          />
        </div>
        <div className="formItem">
          <label name="reservation_date">Reservation Date</label>
          <input
            id="date"
            type="date"
            name="reservation_date"
            onChange={(e) => handleInput(e)}
            defaultValue={form.reservation_date}
          />
        </div>
        <div className="formItem">
          <label name="reservation_time">Reservation Time</label>
          <input
            id="time"
            type="time"
            name="reservation_time"
            onChange={(e) => handleInput(e)}
            defaultValue={form.reservation_time}
          />
        </div>
        <div className="formItem">
          <label name="people">People</label>
          <input
            id="people"
            type="number"
            name="people"
            onChange={(e) => handleInput(e)}
            defaultValue={form.people}
          />
        </div>
        <div className="formItem">
          <button onClick={(e) => handleButtonSubmit(e)} type="submit">
            Submit
          </button>
          <button name="cancel">
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

export default Edit;
