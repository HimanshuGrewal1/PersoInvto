import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AnimeInventory from './components/AnimeInventory';
import BookInventory from './components/BookInventory';
import ExpenseInventory from './components/ExpenseInventory';

function App() {
  const [user, setUser] = useState(null);

  // Simple auth state check (could be improved with context or redux)
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

//   setUser(true)

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onSignup={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex justify-between">
          <div className="space-x-4">
            <Link to="/anime" className="text-blue-600 hover:underline">
              Anime Inventory
            </Link>
            <Link to="/books" className="text-blue-600 hover:underline">
              Book Inventory
            </Link>
            <Link to="/expenses" className="text-blue-600 hover:underline">
              Expenses
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </nav>
        <main className="p-4">
          <Routes>
            {/* <Route path="/anime" element={<AnimeInventory />} /> */}
            <Route path="/books" element={<BookInventory />} />
            <Route path="/expenses" element={<ExpenseInventory />} />
            <Route path="*" element={<Navigate to="/anime" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
