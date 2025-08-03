import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig.js'; // alohida konfiguratsiyalangan bo‘lsa

export default function AddressAutocomplete({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [suggests, setSuggests] = useState([]);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const fetchSuggests = async (text) => {
    try {
      const res = await axios.get('/api/yandex-suggest', {
        params: {
          text,
          lang: 'uz_UZ',
          results: 5
        }
      });

      // 👇 Yandex'dan kelgan data formatini tekshir
      const items = res.data.results?.map(item => item.title?.text) || [];
      setSuggests(items);
    } catch (err) {
      console.error('❌ Manzil tavsiyalarini olishda xatolik:', err);
      setSuggests([]);
    }
  };

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggests([]);
      return;
    }

    const timeout = setTimeout(() => fetchSuggests(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (address) => {
    setQuery(address);
    setSuggests([]);
    onChange?.(address); // 🙌 tashqi formaga qaytaramiz
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        autoComplete="off"
        placeholder="Manzilni kiriting..."
        className="w-full border rounded p-2"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value); // jonli input
        }}
      />

      {suggests.length > 0 && (
        <ul className="absolute z-20 bg-white border mt-1 w-full max-h-48 overflow-auto rounded shadow">
          {suggests.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
