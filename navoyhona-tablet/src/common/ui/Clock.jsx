import { useEffect, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000); // ⏱ har 1s yangilanadi
    return () => clearInterval(timer); // tozalash
  }, []);

  const formatted = now.toLocaleString('uz-UZ', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="text-sm text-gray-700 font-mono">
      🕒 {formatted}
    </div>
  );
}
