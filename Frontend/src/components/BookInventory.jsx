import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookInventory() {
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        setBookList(response.data);
      } catch (err) {
        setError('Failed to fetch book inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <p>Loading book inventory...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Book Inventory</h2>
      {bookList.length === 0 ? (
        <p>No books found in your inventory.</p>
      ) : (
        <ul className="space-y-2">
          {bookList.map((book) => (
            <li key={book._id} className="border p-3 rounded bg-white shadow">
              <h3 className="font-semibold">{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Status: {book.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookInventory;
