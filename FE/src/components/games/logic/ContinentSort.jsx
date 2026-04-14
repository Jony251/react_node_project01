import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const COUNTRIES = [
  { name: 'France', continent: 'Europe' },
  { name: 'Brazil', continent: 'South America' },
  { name: 'Japan', continent: 'Asia' },
  { name: 'Kenya', continent: 'Africa' },
  { name: 'Australia', continent: 'Australia/Oceania' },
  { name: 'Canada', continent: 'North America' },
  { name: 'China', continent: 'Asia' },
  { name: 'Egypt', continent: 'Africa' },
  { name: 'Germany', continent: 'Europe' },
  { name: 'Mexico', continent: 'North America' },
  { name: 'Argentina', continent: 'South America' },
  { name: 'India', continent: 'Asia' },
  { name: 'Nigeria', continent: 'Africa' },
  { name: 'Spain', continent: 'Europe' },
  { name: 'New Zealand', continent: 'Australia/Oceania' },
];

const CONTINENTS = [...new Set(COUNTRIES.map(c => c.continent))];

function makeQ() {
  const item = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  return { item };
}

export default function ContinentSort({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(c => {
    if (chosen) return;
    setChosen(c);
    if (c === q.item.continent) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>On which continent is <strong>{q.item.name}</strong>?</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        {CONTINENTS.map(c => (
          <button
            key={c}
            className={`${styles.choice} ${chosen ? (c === q.item.continent ? styles.correct : c === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '0.9rem', flex: '1 1 180px' }}
            onClick={() => pick(c)}
          >{c}</button>
        ))}
      </div>
    </div>
  );
}
