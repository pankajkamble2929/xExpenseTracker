import React, { useState } from "react";

export default function BalanceModal({ onClose, onAdd }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      alert("Enter a positive amount");
      return;
    }
    onAdd(num);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Balance</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Income Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
          <div className="modal-buttons">
            <button type="submit" className="btn add-balance">
              Add Balance
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => {
                setAmount("");
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
