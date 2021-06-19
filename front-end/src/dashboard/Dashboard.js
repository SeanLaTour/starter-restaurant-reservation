import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
const axios = require("axios");

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ onLoadDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDateState] = useState(onLoadDate);
  const today = onLoadDate;
  const [tables, setTables] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(loadDashboard, [date]);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadTables() {
      try {
        const response = await fetch(`${API_BASE_URL}/tables`, {
          signal: abortController.signal,
        });
        const data = await response.json();
        setTables(data.data);
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
  }, [tableLoader, API_BASE_URL]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [date, tableLoader]);

  function handleButtonToday() {
    const dateRegFormat = new Date(today);
    let newDate = new Date(dateRegFormat + 86400000);
    let todaysYear = newDate.getFullYear();
    let todaysMonth = newDate.getMonth() + 1;
    let todaysDay = newDate.getDate() + 1;
    const tempDate = `${todaysYear}-${
      todaysMonth < 10 ? `0${todaysMonth}` : `${todaysMonth}`
    }-${todaysDay < 10 ? `0${todaysDay}` : `${todaysDay}`}`;
    setDateState(tempDate);
  }

  function handleButtonPrevious() {
    let dateInMs = new Date(date).getTime();
    let newDate = new Date(dateInMs + 86400000);
    let newYear = newDate.getFullYear();
    let newMonth = newDate.getMonth() + 1;
    let newDay = newDate.getDate() - 1;
    if (
      newMonth === 2 ||
      newMonth === 4 ||
      newMonth === 6 ||
      newMonth === 9 ||
      newMonth === 11
    ) {
      if (newDay < 1) {
        newMonth -= 1;
        newDay = 31;
      }
    } else {
      if (newDay < 1) {
        newMonth -= 1;
        newDay = 30;
      }
    }
    const tempDate = `${newYear}-${
      newMonth < 10 ? `0${newMonth}` : `${newMonth}`
    }-${newDay < 10 ? `0${newDay}` : `${newDay}`}`;
    setDateState(tempDate);
  }

  function handleButtonNext() {
    let dateInMs = new Date(date).getTime();
    let newDate = new Date(dateInMs + 86400000);
    let newYear = newDate.getFullYear();
    let newMonth = newDate.getMonth() + 1;
    let newDay = newDate.getDate() + 1;
    if (
      newMonth === 1 ||
      newMonth === 3 ||
      newMonth === 5 ||
      newMonth === 7 ||
      newMonth === 8 ||
      newMonth === 10 ||
      newMonth === 12
    ) {
      if (newDay > 31) {
        newMonth += 1;
        newDay = 1;
      }
    } else {
      if (newDay > 30) {
        newMonth += 1;
        newDay = 1;
      }
    }

    const tempDate = `${newYear}-${
      newMonth < 10 ? `0${newMonth}` : `${newMonth}`
    }-${newDay < 10 ? `0${newDay}` : `${newDay}`}`;
    setDateState(tempDate);
  }

  function handleButtonFinish(e) {
    const table_id = e.target.id;
    const data = {
      data: { table_id },
    };
    axios
      .delete(`${API_BASE_URL}/tables/${table_id}/seat`, { data })
      .then(() => {
        setTableLoader(!tableLoader);
      })
      .catch((err) => setError(err.response.data.error));
  }

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
        setError(err.response.data.error)
      });
  }

  // See if this can be made into a const
  let listTables = tables.map((table, index) => {
    return (
      <tr key={index}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={`${table.table_id}`}>
          {table.reservation_id == null ? "Free" : "Occupied"}
        </td>
        <td className="tdButton" style={{ borderStyle: "none" }}>
          {table.reservation_id == null ? null : (
            <button
              id={table.table_id}
              data-table-id-finish={table.table_id}
              onClick={(e) => {
                if (
                  window.confirm(
                    "Is this table ready to seat new guests? This cannot be undone."
                  )
                ) {
                  handleButtonFinish(e);
                }
              }}
            >
              Finish
            </button>
          )}
        </td>
      </tr>
    );
  });

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
          {reservation.status === "booked" ? (
            <button
              className="tButton"
              style={{ padding: "8px", marginLeft: "2px" }}
            >
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                Seat
              </Link>
            </button>
          ) : null}
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

  if (reservations.length < 1) {
    return (
      <main>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date {date}</h4>
        </div>
        <div>
          <button
            onClick={() => handleButtonPrevious()}
            className="tableButtons"
          >
            Previous
          </button>
          <button onClick={() => handleButtonToday()} className="tableButtons">
            Today
          </button>
          <button onClick={() => handleButtonNext()} className="tableButtons">
            Next
          </button>
        </div>
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={error} />
        <h2>There are no reservations for this day.</h2>
      </main>
    );
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for date {date}</h4>
          </div>
          <div>
            <button
              onClick={() => handleButtonPrevious()}
              className="tableButtons"
            >
              Previous
            </button>
            <button
              onClick={() => handleButtonToday()}
              className="tableButtons"
            >
              Today
            </button>
            <button onClick={() => handleButtonNext()} className="tableButtons">
              Next
            </button>
          </div>
          <ErrorAlert error={reservationsError} />
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
        <div style={{ marginLeft: "150px" }}>
          <h4>Tables</h4>
          <table>
            <thead>
              <tr>
                <td>Table</td>
                <td>Capacity</td>
                <td>Availability</td>
              </tr>
            </thead>
            <tbody>{listTables}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
