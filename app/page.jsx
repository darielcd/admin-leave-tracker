"use client";
import { useState, useEffect } from "react";

export default function AdminLeaveTracker() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    excessADEarned: "",
    electionsEarned: "",
    electionsUsed: "",
    hurricaneADEarned: "",
    hurricaneUsed: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("adminLeaveEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminLeaveEntries", JSON.stringify(entries));
  }, [entries]);

  const calculateBalances = ({ electionsEarned, electionsUsed, hurricaneADEarned, hurricaneUsed, excessADEarned }) => {
  const electionsBalance = (parseFloat(electionsEarned) || 0) - (parseFloat(electionsUsed) || 0);
  const hurricaneBalance = (parseFloat(hurricaneADEarned) || 0) - (parseFloat(hurricaneUsed) || 0);
  const totalBalance = electionsBalance + hurricaneBalance + (parseFloat(excessADEarned) || 0);
  return { electionsBalance, hurricaneBalance, totalBalance };
};

  };

  const handleSubmit = () => {
    const cleanedForm = {
      ...form,
      electionsEarned: parseFloat(form.electionsEarned) || 0,
      electionsUsed: parseFloat(form.electionsUsed) || 0,
      hurricaneADEarned: parseFloat(form.hurricaneADEarned) || 0,
      hurricaneUsed: parseFloat(form.hurricaneUsed) || 0,
      excessADEarned: parseFloat(form.excessADEarned) || 0
    };

    const balances = calculateBalances(cleanedForm);
    setEntries([...entries, { ...form, ...balances }]);
    setForm({
      date: "",
      excessADEarned: "",
      electionsEarned: "",
      electionsUsed: "",
      hurricaneADEarned: "",
      hurricaneUsed: ""
    });
  };

  const handleDelete = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  const totalBalanceSum = entries.reduce((sum, e) => sum + (parseFloat(e.totalBalance) || 0), 0);

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "2rem",
      padding: "2rem",
      fontFamily: "sans-serif",
      flexWrap: "wrap"
    }}>
      {/* Left Column - Form */}
      <div style={{ flex: 1, minWidth: "300px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>Dariel Candelario</h1>
          <p style={{ marginBottom: "0.5rem" }}>Employee ID: E326045</p>
          <div style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "1rem",
            backgroundColor: "#dff0d8",
            borderRadius: "4px",
            color: "#2c662d"
          }}>
            ✅ Total Hours Balance: {totalBalanceSum.toFixed(2)}
          </div>
        </div>

        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Add Administrative Leave Entry
        </h2>
        {[
          { label: "Date", key: "date" },
          { label: "Excess Hours AD Earned", key: "excessADEarned" },
          { label: "Elections Earned", key: "electionsEarned" },
          { label: "Elections Used", key: "electionsUsed" },
          { label: "Hurricane AD Earned", key: "hurricaneADEarned" },
          { label: "Hurricane Used", key: "hurricaneUsed" }
        ].map(({ label, key }) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.25rem" }}>{label}</label>
            <input
              type={key === "date" ? "text" : "number"}
              step="0.01"
              inputMode={key === "date" ? "text" : "decimal"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                padding: "0.5rem",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          Add Entry
        </button>
      </div>

      {/* Right Column - Entries */}
      <div style={{ flex: 1, minWidth: "300px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Entries</h2>
        {entries.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          <ul>
            {entries.map((entry, index) => (
              <li key={index} style={{
                marginBottom: "1rem",
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9"
              }}>
                <p><strong>Date:</strong> {entry.date}</p>
                <p><strong>Excess AD Earned:</strong> {entry.excessADEarned}</p>
                <p><strong>Elections Balance:</strong> {entry.electionsBalance}</p>
                <p><strong>Hurricane Balance:</strong> {entry.hurricaneBalance}</p>
                <p><strong>Total Balance:</strong> {entry.totalBalance}</p>
                <button
                  onClick={() => handleDelete(index)}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
