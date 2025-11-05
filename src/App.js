import React, { useEffect, useState } from "react";
import BalanceModal from "./components/BalanceModal";
import ExpenseModal from "./components/ExpenseModal";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import "./App.css";

function App() {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem("balance");
    return stored ? Number(stored) : 5000;
  });

  const [expenses, setExpenses] = useState(() => {
    const stored = localStorage.getItem("expenses");
    return stored ? JSON.parse(stored) : [];
  });

  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("balance", String(balance));
  }, [balance]);

  // compute total expenses (sum of prices)
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.price), 0);

  // Add balance (from BalanceModal) -> amount is number
  const handleAddBalance = (amount) => {
    if (!amount || Number(amount) <= 0) return;
    setBalance((b) => Number(b) + Number(amount));
  };

  // Add a new expense
  const handleAddExpense = (expense) => {
    const amt = Number(expense.price);
    if (!expense.title || !expense.price || !expense.category || !expense.date) {
      alert("Please fill all expense fields");
      return false;
    }
    if (amt <= 0 || isNaN(amt)) {
      alert("Enter valid positive amount");
      return false;
    }
    if (amt > balance) {
      alert("Insufficient balance!");
      return false;
    }

    const newExpense = {
      id: Date.now(),
      title: expense.title,
      price: amt,
      category: expense.category,
      date: expense.date,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setBalance((b) => Number(b) - amt);
    return true;
  };

  // Delete expense
  const handleDeleteExpense = (id) => {
    const toDelete = expenses.find((e) => e.id === id);
    if (!toDelete) return;
    // refund the amount back to balance
    setBalance((b) => Number(b) + Number(toDelete.price));
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Start editing expense
  const handleStartEdit = (expense) => {
    setEditExpense(expense);
    setShowExpenseModal(true);
  };

  // Apply edit
  const handleApplyEdit = (updatedExpense) => {
    // updatedExpense includes id, title, price, category, date
    const old = expenses.find((e) => e.id === updatedExpense.id);
    if (!old) return false;

    const oldPrice = Number(old.price);
    const newPrice = Number(updatedExpense.price);

    // If increasing expense amount, check balance
    const diff = newPrice - oldPrice;
    if (diff > 0 && diff > balance) {
      alert("Insufficient balance to increase expense amount");
      return false;
    }

    // Update balance (if diff positive, subtract; if negative, add back)
    setBalance((b) => Number(b) - diff);

    // Replace expense in list
    setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));

    return true;
  };

  const handleCloseExpenseModal = () => {
    setEditExpense(null);
    setShowExpenseModal(false);
  };

  const categories = [...new Set(expenses.map((e) => e.category))];
  // include some default categories for UX
  const defaultCategories = ["Food", "Entertainment", "Travel", "Other"];
  const allCategories = Array.from(new Set([...defaultCategories, ...categories]));

  return (
    <div className="app-wrapper">
      <header>
        <h1>Expense Tracker</h1>
      </header>

      <main className="main-content">
        <section className="top-panel">
          <div className="wallet-card">
            <h2>Wallet Balance:</h2>
            <div className="balance-amount">₹{Number(balance).toLocaleString()}</div>
            <button type="button" className="btn income" onClick={() => setShowBalanceModal(true)}>
              + Add Income
            </button>
          </div>

          <div className="expenses-card">
            <h2>Expenses: ₹{Number(totalExpenses).toLocaleString()}</h2>
            <button
              type="button"
              className="btn expense"
              onClick={() => {
                setEditExpense(null);
                setShowExpenseModal(true);
              }}
            >
              + Add Expense
            </button>
          </div>

          <Summary expenses={expenses} categories={allCategories} />
        </section>

        <section className="lower-panel">
          <div className="recent-transactions">
            <h3>Recent Transactions</h3>
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onEdit={handleStartEdit}
            />
          </div>

          <div className="top-expenses">
            <h3>Top Expenses</h3>
            <div className="top-expenses-card">
              {/* simple list + bar */}
              {allCategories.map((cat) => {
                const sum = expenses
                  .filter((e) => e.category === cat)
                  .reduce((s, x) => s + Number(x.price), 0);
                return (
                  <div key={cat} className="category-row">
                    <div className="cat-label">{cat} -</div>
                    <div className="cat-bar">
                      <div
                        className="cat-bar-fill"
                        style={{
                          width: `${Math.min(100, allCategories.length ? (sum / (totalExpenses || 1)) * 100 : 0)}%`,
                        }}
                      />
                    </div>
                    <div className="cat-value">₹{sum}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {showBalanceModal && (
        <BalanceModal
          onClose={() => setShowBalanceModal(false)}
          onAdd={(amount) => {
            handleAddBalance(amount);
            setShowBalanceModal(false);
          }}
        />
      )}

      {showExpenseModal && (
        <ExpenseModal
          initial={editExpense}
          onClose={handleCloseExpenseModal}
          onAdd={(data) => {
            const ok = handleAddExpense(data);
            if (ok) setShowExpenseModal(false);
            return ok;
          }}
          onEdit={(data) => {
            const ok = handleApplyEdit(data);
            if (ok) {
              setShowExpenseModal(false);
              setEditExpense(null);
            }
            return ok;
          }}
          categories={allCategories}
        />
      )}
    </div>
  );
}

export default App;
