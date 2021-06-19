import React from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function Form({ handleButtonSubmit, error, form, setForm }) {
  function handleInput(e) {
    const name = e.target.name;
    if (name === "people") {
      const people = Number(e.target.value);
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
  );
}

export default Form;
