import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "../Form/Form";
const axios = require("axios");

function NewReservation() {
  const history = useHistory();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: null,
    reservation_time: null,
    people: 0,
    status: "booked",
  });
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const abortController = new AbortController();

  function handleButtonSubmit(e) {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/reservations`, {
        data: form,
      })
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
      <Form
        handleButtonSubmit={handleButtonSubmit}
        error={error}
        form={form}
        setForm={setForm}
      />
    </div>
  );
}

export default NewReservation;
