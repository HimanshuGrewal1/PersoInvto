import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExpenseInventory() {
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/api/expenses');
        setExpenseList(response.data);
      } catch (err) {
        setError('Failed to fetch expenses');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Expenses</h2>
      {expenseList.length === 0 ? (
        <p>No expenses recorded.</p>
      ) : (
        <ul className="space-y-2">
          {expenseList.map((expense) => (
            <li key={expense._id} className="border p-3 rounded bg-white shadow">
              <h3 className="font-semibold">{expense.description}</h3>
              <p>Amount: ${expense.amount}</p>
              <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseInventory;
