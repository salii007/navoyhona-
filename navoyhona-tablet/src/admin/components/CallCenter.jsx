import { useState, useEffect } from 'react';
import { FiPhoneCall, FiPhoneOff } from 'react-icons/fi';
import '../styles/callcenter.css';

export default function CallCenter() {
  const [dial, setDial] = useState('');
  const [log, setLog] = useState([]);

  const handleNumber = (val) => setDial(prev => prev + val);
  const handleBackspace = () => setDial(prev => prev.slice(0, -1));
  const handleCall = () => {
    const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    setLog(prev => [{ time, number: dial }, ...prev]);
  };
  const handleHangup = () => {
    
  };
  

  useEffect(() => {
    const handleKey = (e) => {
      if (/^[0-9]$/.test(e.key)) handleNumber(e.key);
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === '+') handleNumber('+');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="call-center-container">
      {/* Chap – qo‘ng‘iroqlar ro‘yxati */}
      <div className="call-center-left">
        <h2>📋 Bugungi qo‘ng‘iroqlar:</h2>
        <ul>
          {log.length === 0 && <li className="text-muted">Hozircha yo‘q</li>}
          {log.map((item, idx) => (
            <li key={idx} className="log-entry">
              <span>{item.time}</span>
              <span>{item.number}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* O‘ng – raqam paneli */}
      <div className="call-center-right">
        <div className="call-screen">
          {dial || '+998'}
        </div>

        <div className="dial-pad">
          {[ [1,2,3], [4,5,6], [7,8,9] ].map((row, idx) => (
            <div key={idx} className="dial-pad-row">
              {row.map(n => (
                <button key={n} onClick={() => handleNumber(n.toString())} className="dial-button">
                  {n}
                </button>
              ))}
            </div>
          ))}
          <div className="dial-pad-row">
            <div />
            <button onClick={() => handleNumber('0')} className="dial-button">0</button>
            <button onClick={() => handleNumber('+')} className="dial-button">+</button>
          </div>
        </div>

        <div className="call-buttons">
          <button onClick={handleBackspace} className="backspace">⌫</button>
          <button onClick={handleCall} className="call"><FiPhoneCall /></button>
          <button onClick={handleHangup} className="hangup"><FiPhoneOff /></button>
        </div>
      </div>
    </div>
  );
}
