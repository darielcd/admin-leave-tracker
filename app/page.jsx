"use client";
import { useState } from "react";

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

  const calculateBalances = ({ electionsEarned, electionsUsed, hurricaneADEarned, hurricaneUsed }) => {
    const electionsBalance = (parseFloat(electionsEarned) || 0) - (parseFloat(electionsUsed) || 0);
    const hurricaneBalance = (parseFloat(hurricaneADEarned) || 0) - (parseFloat(hurricaneUsed) || 0);
    const totalBalance = electionsBalance + hurricaneBalance;
    return { electionsBalance, hurricaneBalance, totalBalance };
  };

  const handleSubmit = () => {
    const balances = calculateBalances(form);
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

  const totalBalanceSum = entries.reduce((sum, e) => sum + (e.totalBalance || 0), 0);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
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
            type="text"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={{ padding: "0.5rem", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
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
          cursor: "pointer"
        }}
      >
        Add Entry
      </button>

      <h2 style={{ marginTop: "2rem", fontSize: "1.25rem", fontWeight: "bold" }}>Entries</h2>
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={index} style={{ marginBottom: "1rem", border: "1px solid #ddd", padding: "1rem" }}>
              <p><strong>Date:</strong> {entry.date}</p>
              <p><strong>Excess AD Earned:</strong> {entry.excessADEarned}</p>
              <p><strong>Elections Balance:</strong> {entry.electionsBalance}</p>
              <p><strong>Hurricane Balance:</strong> {entry.hurricaneBalance}</p>
              <p><strong>Total Balance:</strong> {entry.totalBalance}</p>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "2rem", fontSize: "1.1rem", fontWeight: "bold" }}>
        ✅ Total Hours Balance Across All Entries: {totalBalanceSum.toFixed(2)}
      </div>
    </div>
  );
}
