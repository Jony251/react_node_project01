import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const CAPITALS = [
  { country: 'France', capital: 'Paris' },
  { country: 'Germany', capital: 'Berlin' },
  { country: 'Japan', capital: 'Tokyo' },
  { country: 'Brazil', capital: 'Brasília' },
  { country: 'Australia', capital: 'Canberra' },
  { country: 'Canada', capital: 'Ottawa' },
  { country: 'United Kingdom', capital: 'London' },
  { country: 'Italy', capital: 'Rome' },
  { country: 'Spain', capital: 'Madrid' },
  { country: 'Egypt', capital: 'Cairo' },
  { country: 'China', capital: 'Beijing' },
  { country: 'India', capital: 'New Delhi' },
  { country: 'Russia', capital: 'Moscow' },
  { country: 'Mexico', capital: 'Mexico City' },
  { country: 'Argentina', capital: 'Buenos Aires' },
  { country: 'Sweden', capital: 'Stockholm' },
  { country: 'Norway', capital: 'Oslo' },
  { country: 'South Korea', capital: 'Seoul' },
  { country: 'South Africa', capital: 'Pretoria' },
  { country: 'Nigeria', capital: 'Abuja' },
];

function makeQ() {
  const pool = [...CAPITALS].sort(() => Math.random() - 0.5);
  const target = pool[0];
  const opts = [target.capital, ...pool.slice(1, 4).map(c => c.capital)].sort(() => Math.random() - 0.5);
  return { target, opts };
}

export default function WorldCapitals({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(c => {
    if (chosen) return;
    setChosen(c);
    if (c === q.target.capital) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>What is the capital of <strong>{q.target.country}</strong>?</p>
      <div className={styles.choices} style={{ marginTop: '1.5rem' }}>
        {q.opts.map(c => (
          <button
            key={c}
            className={`${styles.choice} ${chosen ? (c === q.target.capital ? styles.correct : c === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '0.95rem' }}
            onClick={() => pick(c)}
          >{c}</button>
        ))}
      </div>
    </div>
  );
}
