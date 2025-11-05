import React, { useEffect, useState } from "react";

export default function ExpenseModal({ initial = null, onClose, onAdd, onEdit, categories = [] }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setPrice(initial.price);
      setCategory(initial.category);
      setDate(initial.date);
    } else {
      setTitle("");
      setPrice("");
      setCategory("");
      setDate("");
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: initial?.id,
      title: title.trim(),
      price: Number(price),
      category: category.trim(),
      date,
    };

    if (!payload.title || !payload.price || !payload.category || !payload.date) {
      alert("Please fill all fields");
      return;
    }

    if (initial) {
      const ok = onEdit(payload);
      if (ok) {
        // clear handled by parent close
      }
    } else {
      const ok = onAdd(payload);
      if (ok) {
        // clear fields
        setTitle("");
        setPrice("");
        setCategory("");
        setDate("");
      }
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{initial ? "Edit Expense" : "Add Expenses"}</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-row">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
            />
          </div>

          <div className="form-row">
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn add-expense">
              Add Expense
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => {
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
