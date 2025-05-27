
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .order("date", { ascending: true });

    if (!error) setEntries(data);
    else console.error("Error fetching entries:", error);
  };

  const handleSubmit = async () => {
    const cleanedForm = {
      date: form.date,
      excessADEarned: parseFloat(form.excessADEarned) || 0,
      excessADUsed: parseFloat(form.excessADUsed) || 0,
      electionsEarned: parseFloat(form.electionsEarned) || 0,
      electionsUsed: parseFloat(form.electionsUsed) || 0,
      hurricaneADEarned: parseFloat(form.hurricaneADEarned) || 0,
      hurricaneUsed: parseFloat(form.hurricaneUsed) || 0
    };

    const { error } = await supabase.from("entries").insert([cleanedForm]);

    if (!error) {
      setForm({
        date: "",
        excessADEarned: "",
        excessADUsed: "",
        electionsEarned: "",
        electionsUsed: "",
        hurricaneADEarned: "",
        hurricaneUsed: ""
      });
      fetchEntries();
    } else {
      console.error("Error submitting entry:", error);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("entries").delete().eq("id", id);
    if (!error) fetchEntries();
    else console.error("Error deleting entry:", error);
  };

  const calculateBalances = (entry) => {
    const electionsBalance = entry.electionsEarned - entry.electionsUsed;
    const hurricaneBalance = entry.hurricaneADEarned - entry.hurricaneUsed;
    const excessBalance = entry.excessADEarned - entry.excessADUsed;
    const totalBalance = electionsBalance + hurricaneBalance + excessBalance;
    return { electionsBalance, hurricaneBalance, excessBalance, totalBalance };
  };

  const totalBalanceSum = entries.reduce((sum, entry) => {
    const { totalBalance } = calculateBalances(entry);
    return sum + totalBalance;
  }, 0);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <h1>Dariel Candelario</h1>
      <p>Employee ID: E326045</p>
      <h2>Total Hours Balance: {totalBalanceSum.toFixed(2)}</h2>

      <div>
        <input type="text" placeholder="Date" value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input type="number" placeholder="Excess AD Earned" value={form.excessADEarned}
          onChange={(e) => setForm({ ...form, excessADEarned: e.target.value })} />
        <input type="number" placeholder="Excess AD Used" value={form.excessADUsed}
          onChange={(e) => setForm({ ...form, excessADUsed: e.target.value })} />
        <input type="number" placeholder="Elections Earned" value={form.electionsEarned}
          onChange={(e) => setForm({ ...form, electionsEarned: e.target.value })} />
        <input type="number" placeholder="Elections Used" value={form.electionsUsed}
          onChange={(e) => setForm({ ...form, electionsUsed: e.target.value })} />
        <input type="number" placeholder="Hurricane AD Earned" value={form.hurricaneADEarned}
          onChange={(e) => setForm({ ...form, hurricaneADEarned: e.target.value })} />
        <input type="number" placeholder="Hurricane Used" value={form.hurricaneUsed}
          onChange={(e) => setForm({ ...form, hurricaneUsed: e.target.value })} />
        <button onClick={handleSubmit}>Add Entry</button>
      </div>

      <ul>
        {entries.map((entry) => {
          const balances = calculateBalances(entry);
          return (
            <li key={entry.id}>
              <p><strong>Date:</strong> {entry.date}</p>
              <p><strong>Excess Balance:</strong> {balances.excessBalance}</p>
              <p><strong>Elections Balance:</strong> {balances.electionsBalance}</p>
              <p><strong>Hurricane Balance:</strong> {balances.hurricaneBalance}</p>
              <p><strong>Total Balance:</strong> {balances.totalBalance}</p>
              <button onClick={() => handleDelete(entry.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
