import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const FLAGS = [
  { emoji: '🇺🇸', country: 'United States' },
  { emoji: '🇬🇧', country: 'United Kingdom' },
  { emoji: '🇫🇷', country: 'France' },
  { emoji: '🇩🇪', country: 'Germany' },
  { emoji: '🇯🇵', country: 'Japan' },
  { emoji: '🇧🇷', country: 'Brazil' },
  { emoji: '🇨🇳', country: 'China' },
  { emoji: '🇮🇳', country: 'India' },
  { emoji: '🇷🇺', country: 'Russia' },
  { emoji: '🇦🇺', country: 'Australia' },
  { emoji: '🇨🇦', country: 'Canada' },
  { emoji: '🇲🇽', country: 'Mexico' },
  { emoji: '🇮🇹', country: 'Italy' },
  { emoji: '🇪🇸', country: 'Spain' },
  { emoji: '🇧🇪', country: 'Belgium' },
  { emoji: '🇳🇱', country: 'Netherlands' },
  { emoji: '🇵🇱', country: 'Poland' },
  { emoji: '🇸🇪', country: 'Sweden' },
  { emoji: '🇳🇴', country: 'Norway' },
  { emoji: '🇨🇭', country: 'Switzerland' },
  { emoji: '🇦🇷', country: 'Argentina' },
  { emoji: '🇿🇦', country: 'South Africa' },
  { emoji: '🇪🇬', country: 'Egypt' },
  { emoji: '🇳🇬', country: 'Nigeria' },
  { emoji: '🇰🇷', country: 'South Korea' },
];

function makeQ() {
  const pool = [...FLAGS].sort(() => Math.random() - 0.5);
  const target = pool[0];
  const opts = [target.country, ...pool.slice(1, 4).map(f => f.country)].sort(() => Math.random() - 0.5);
  return { target, opts };
}

export default function FlagQuiz({ onScore }) {
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
      <p className={styles.question}>Which country does this flag belong to?</p>
      <div style={{ fontSize: '6rem', margin: '0.5rem 0 1.5rem', lineHeight: 1 }}>{q.target.emoji}</div>
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
