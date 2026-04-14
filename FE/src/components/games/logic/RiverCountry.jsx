import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const RIVERS = [
  { river: 'Nile', country: 'Egypt' },
  { river: 'Amazon', country: 'Brazil' },
  { river: 'Yangtze', country: 'China' },
  { river: 'Mississippi', country: 'USA' },
  { river: 'Thames', country: 'United Kingdom' },
  { river: 'Rhine', country: 'Germany' },
  { river: 'Ganges', country: 'India' },
  { river: 'Danube', country: 'Austria' },
  { river: 'Volga', country: 'Russia' },
  { river: 'Congo', country: 'DR Congo' },
  { river: 'Niger', country: 'Nigeria' },
  { river: 'Murray', country: 'Australia' },
];

function makeQ() {
  const pool = [...RIVERS].sort(() => Math.random() - 0.5);
  const target = pool[0];
  const opts = [target.country, ...pool.slice(1, 4).map(r => r.country)].sort(() => Math.random() - 0.5);
  return { target, opts };
}

export default function RiverCountry({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(c => {
    if (chosen) return;
    setChosen(c);
    if (c === q.target.country) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>🏞️ The <strong>{q.target.river}</strong> river flows through which country?</p>
      <div className={styles.choices} style={{ marginTop: '1.5rem' }}>
        {q.opts.map(c => (
          <button
            key={c}
            className={`${styles.choice} ${chosen ? (c === q.target.country ? styles.correct : c === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '0.95rem' }}
            onClick={() => pick(c)}
          >{c}</button>
        ))}
      </div>
    </div>
  );
}
