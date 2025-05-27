"use client";
import { useState, useEffect } from "react";

export default function AdminLeaveTracker() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    excessADEarned: "",
    excessADUsed: "",
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

  const calculateBalances = ({ electionsEarned, electionsUsed, hurricaneADEarned, hurricaneUsed, excessADEarned, excessADUsed }) => {
    const electionsBalance = (parseFloat(electionsEarned) || 0) - (parseFloat(electionsUsed) || 0);
    const hurricaneBalance = (parseFloat(hurricaneADEarned) || 0) - (parseFloat(hurricaneUsed) || 0);
    const excessBalance = (parseFloat(excessADEarned) || 0) - (parseFloat(excessADUsed) || 0);
    const totalBalance = electionsBalance + hurricaneBalance + excessBalance;

    return { electionsBalance, hurricaneBalance, excessBalance, totalBalance };
  };

  const handleSubmit = () => {
    const cleanedForm = {
      date: form.date,
      excessADEarned: parseFloat(form.excessADEarned) || 0,
      excessADUsed: parseFloat(form.excessADUsed) || 0,
      electionsEarned: parseFloat(form.electionsEarned) || 0,
      electionsUsed: parseFloat(form.electionsUsed) || 0,
      hurricaneADEarned: parseFloat(form.hurricaneADEarned) || 0,
      hurricaneUsed: parseFloat(form.hurricaneUsed) || 0
    };

    const balances = calculateBalances(cleanedForm);
    setEntries([...entries, { ...cleanedForm, ...balances }]);

    setForm({
      date: "",
      excessADEarned: "",
      excessADUsed: "",
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
      flexWrap: "wrap",
      minHeight: "100vh",
      backgroundColor: "#121212",
      backgroundImage: "url('/dark-brick-texture.png')",
      backgroundSize: "auto",
      backgroundRepeat: "repeat",
      color: "#f5f5f5"
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
            backgroundColor: "#1e1e1e",
            borderRadius: "4px",
            color: "#90ee90"
          }}>
            ✅ Total Hours Balance: {totalBalanceSum.toFixed(2)}
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Date</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={{
              padding: "0.5rem",
              width: "100%",
              border: "1px solid #444",
              borderRadius: "4px",
              backgroundColor: "#222",
              color: "#fff"
            }}
          />
        </div>

        <h3 style={{ marginTop: "1rem" }}>➕ Hours Earned</h3>
        {[
          { label: "Excess Hours AD Earned", key: "excessADEarned" },
          { label: "Elections Earned", key: "electionsEarned" },
          { label: "Hurricane AD Earned", key: "hurricaneADEarned" }
        ].map(({ label, key }) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>{label}</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                padding: "0.5rem",
                width: "100%",
                border: "1px solid #444",
                borderRadius: "4px",
                backgroundColor: "#222",
                color: "#fff"
              }}
            />
          </div>
        ))}

        <h3 style={{ marginTop: "1rem" }}>➖ Hours Used</h3>
        {[
          { label: "Excess Hours AD Used", key: "excessADUsed" },
          { label: "Elections Used", key: "electionsUsed" },
          { label: "Hurricane Used", key: "hurricaneUsed" }
        ].map(({ label, key }) => (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <label>{label}</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                padding: "0.5rem",
                width: "100%",
                border: "1px solid #444",
                borderRadius: "4px",
                backgroundColor: "#222",
                color: "#fff"
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
                border: "1px solid #444",
                padding: "1rem",
                borderRadius: "4px",
                backgroundColor: "#1e1e1e",
                color: "#eee"
              }}>
                <p><strong>Date:</strong> {entry.date}</p>
                <p><strong>Excess Balance:</strong> {entry.excessBalance}</p>
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
