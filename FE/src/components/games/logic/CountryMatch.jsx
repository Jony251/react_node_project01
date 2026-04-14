import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const LANDMARKS = [
  { emoji: '🗼', landmark: 'Eiffel Tower', country: 'France' },
  { emoji: '🗽', landmark: 'Statue of Liberty', country: 'USA' },
  { emoji: '🏯', landmark: 'Osaka Castle', country: 'Japan' },
  { emoji: '🕌', landmark: 'Taj Mahal', country: 'India' },
  { emoji: '🐉', landmark: 'Great Wall', country: 'China' },
  { emoji: '⛪', landmark: 'Big Ben', country: 'UK' },
  { emoji: '🏟️', landmark: 'Colosseum', country: 'Italy' },
  { emoji: '🎡', landmark: 'Sydney Opera House', country: 'Australia' },
  { emoji: '🌉', landmark: 'Golden Gate Bridge', country: 'USA' },
  { emoji: '🏰', landmark: 'Neuschwanstein Castle', country: 'Germany' },
];

function makeQ() {
  const pool = [...LANDMARKS].sort(() => Math.random() - 0.5);
  const target = pool[0];
  const opts = [target.country, ...pool.slice(1, 4).map(l => l.country)].sort(() => Math.random() - 0.5);
  return { target, opts };
}

export default function CountryMatch({ onScore }) {
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
      <p className={styles.question}>The <strong>{q.target.landmark}</strong> is in which country?</p>
      <div style={{ fontSize: '5rem', margin: '0.5rem 0 1.2rem' }}>{q.target.emoji}</div>
      <div className={styles.choices}>
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
