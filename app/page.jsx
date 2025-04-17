import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLeaveTracker() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    date: "",
    excessHours: "",
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
      excessHours: "",
      excessADEarned: "",
      electionsEarned: "",
      electionsUsed: "",
      hurricaneADEarned: "",
      hurricaneUsed: ""
    });
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">Add Administrative Leave Entry</h2>
          {[
            { label: "Date", key: "date" },
            { label: "Excess Hours Worked", key: "excessHours" },
            { label: "Excess Hours AD Earned", key: "excessADEarned" },
            { label: "Elections Earned", key: "electionsEarned" },
            { label: "Elections Used", key: "electionsUsed" },
            { label: "Hurricane AD Earned", key: "hurricaneADEarned" },
            { label: "Hurricane Used", key: "hurricaneUsed" }
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <Input
                type="text"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <Button onClick={handleSubmit}>Add Entry</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Entries</h2>
          {entries.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div key={index} className="border p-2 rounded">
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Excess Hours:</strong> {entry.excessHours}</p>
                  <p><strong>Excess AD Earned:</strong> {entry.excessADEarned}</p>
                  <p><strong>Elections Balance:</strong> {entry.electionsBalance}</p>
                  <p><strong>Hurricane Balance:</strong> {entry.hurricaneBalance}</p>
                  <p><strong>Total Balance:</strong> {entry.totalBalance}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
