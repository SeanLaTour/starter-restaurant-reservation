import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Form from "../Form/Form";
const axios = require("axios");

function Edit() {
  const params = useParams();
  const history = useHistory();
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const abortController = new AbortController();

  useEffect(() => {
    async function loadTables() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/reservations/${params.reservation_id}`,
          {
            signal: abortController.signal,
          }
        );
        const data = await response.json();
        setForm(data.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          throw error;
        }
      }
    }
    loadTables();
    return () => {
      console.log("cleanup");
      abortController.abort();
    };
  }, [params.reservation_id, API_BASE_URL]);

  function handleButtonSubmit(e) {
    e.preventDefault();
    axios
      .put(`${API_BASE_URL}/reservations/${params.reservation_id}`, {
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

export default Edit;
