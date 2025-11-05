import React from "react";

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  if (!expenses || expenses.length === 0) {
    return <div className="empty-list">No transactions!</div>;
  }

  return (
    <div className="expense-list">
      {expenses.map((exp) => (
        <div key={exp.id} className="expense-item">
          <div className="expense-left">
            <div className="expense-title">{exp.title}</div>
            <div className="expense-date">{exp.date}</div>
          </div>
          <div className="expense-right">
            <div className="expense-price">₹{exp.price}</div>
            <div className="expense-actions">
              <button
                type="button"
                className="action-btn delete"
                onClick={() => onDelete(exp.id)}
                title="Delete"
              >
                ✕
              </button>
              <button
                type="button"
                className="action-btn edit"
                onClick={() => onEdit(exp)}
                title="Edit"
              >
                ✎
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
