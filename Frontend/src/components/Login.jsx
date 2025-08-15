import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/v1/users/login', { email,username, password });
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="email">Username</label>
          <input
            id="username"
            type="username"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <div className=''>OR</div>
        <div>Do not have a account create one <Link to='/signup' className='w-full bg-blue-600 px-5 text-white py-2 rounded hover:bg-blue-700'>signup</Link></div>
      </form>
    </div>
  );
}

export default Login;
