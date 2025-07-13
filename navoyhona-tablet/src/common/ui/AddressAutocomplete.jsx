// src/components/ui/AddressAutocomplete.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig'; // bu http://localhost:5173/api ga proxy qilingan

export default function AddressAutocomplete({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [suggests, setSuggests] = useState([]);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const fetchSuggests = async (text) => {
    try {
      const res = await axios.get('/proxy-suggest', {
        // axiosConfig.js faylingda baseURL = '/api'
        params: { text, lang: 'uz_UZ', results: 5, type: 'geo' },
      });
      // Javobdagi suggestions massivini olamiz
      const items = res.data.suggestions.map(i => i.value);
      setSuggests(items);
    } catch (err) {
      console.error('Suggest fetch xato:', err);
      setSuggests([]);
    }
  };

  useEffect(() => {
    if (query.length < 3) {
      setSuggests([]);
      return;
    }
    const t = setTimeout(() => fetchSuggests(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="Manzilni kiriting..."
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
        }}
      />
      {suggests.length > 0 && (
        <ul className="absolute z-20 bg-white border mt-1 w-full max-h-40 overflow-auto">
          {suggests.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(s);
                setSuggests([]);
                onChange?.(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
