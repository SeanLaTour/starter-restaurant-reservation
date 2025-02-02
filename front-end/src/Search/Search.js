import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
const axios = require("axios");

function Search() {
  const [reservations, setReservations] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const abortController = new AbortController();

  useEffect(() => {
    async function searchMobileNumber() {
      try {
        const mobile = document.getElementById("search").value;
        const response = await fetch(`${API_BASE_URL}/reservations?mobile_number=${mobile}`, {
          signal: abortController.signal,
        });
        const data = await response.json();
        setReservations(data.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          throw error;
        }
      }
    }
    searchMobileNumber();
    return () => {
      console.log("cleanup");
      abortController.abort();
    };
  }, [tableLoader, API_BASE_URL]);

  function handleButtonCancel(e) {
    e.preventDefault();
    const reservation_id = e.target.id;
    const data = {
      reservation_id,
      status: "cancelled",
    };
    axios
      .put(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
        data,
      })
      .then(() => {
        setTableLoader(!tableLoader);
      })
      .catch((err) => {
        setError(err.response.data.error);
        abortController.abort();
      });
  }

  let listRes = reservations.map((reservation, index) => {
    return (
      <tr key={index}>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td className="tdButton">
          <button
            className="tButton"
            style={{ padding: "8px", marginLeft: "2px" }}
          >
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              Edit
            </Link>
          </button>
        </td>
        <td className="tdButton">
          {reservation.status === "cancelled" ? null : (
            <button
              className="tButton"
              id={reservation.reservation_id}
              onClick={(e) => {
                if (
                  window.confirm(
                    "Do you want to cancel this reservation? This cannot be undone."
                  )
                ) {
                  handleButtonCancel(e);
                }
              }}
              style={{ padding: "8px", marginLeft: "2px" }}
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
    );
  });

  if (listRes.length < 1)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          marginLeft: "140px",
        }}
      >
        <form className="form">
          <div className="formItem">
            <label name="search">Search</label>
            <input
              style={{ width: "270px" }}
              id="search"
              placeholder="Enter a customer's phone number"
              name="mobile_number"
            />
          </div>
          <div className="formItem">
            <button
              className="tButton"
              onClick={(e) => {
                e.preventDefault();
                setTableLoader(!tableLoader);
              }}
              type="submit"
            >
              Find
            </button>
            <button className="tButton" name="cancel">
              <Link to="/">Cancel</Link>
            </button>
          </div>
          <div className="formItem">
          {error && <ErrorAlert error={error} />}
        </div>
        </form>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        marginLeft: "140px",
      }}
    >
      <form className="form">
        <div className="formItem">
          <label name="search">Search</label>
          <input
            style={{ width: "270px" }}
            id="search"
            placeholder="Enter a customer's phone number"
            name="mobile_number"
          />
        </div>
        <div className="formItem">
          <button
            onClick={(e) => {
              e.preventDefault();
              setTableLoader(!tableLoader);
            }}
            type="submit"
          >
            Find
          </button>
          <button name="cancel">
            <Link to="/">Cancel</Link>
          </button>
        </div>
        <div className="formItem">
          {error.length > 0 && <ErrorAlert error={error} />}
        </div>
      </form>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "110px",
        }}
      >
        <div>
          <table>
            <thead>
              <tr>
                <td>First</td>
                <td>Last</td>
                <td>Mobile</td>
                <td>Time</td>
                <td>Date</td>
                <td>People</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>{listRes}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Search;
