import React from "react";

export default function Summary({ expenses = [], categories = [] }) {
  const totals = categories.reduce((acc, cat) => {
    acc[cat] = expenses
      .filter((e) => e.category === cat)
      .reduce((s, x) => s + Number(x.price), 0);
    return acc;
  }, {});

  const total = Object.values(totals).reduce((s, n) => s + n, 0) || 0;

  return (
    <div className="summary">
      <h3>Summary</h3>
      <div className="pie-placeholder">
        {/* Simple circular percentage using inline styles */}
        <div className="pie-circle">
          <div className="pie-center">{total ? `${Math.round((totals[categories[0]] || 0) / total * 100) || 0}%` : "0%"}</div>
        </div>
      </div>
      <div className="summary-legend">
        {categories.map((cat) => (
          <div key={cat} className="legend-row">
            <span className="legend-color" />
            <span className="legend-label">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
