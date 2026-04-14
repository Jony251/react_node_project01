import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const PAIRS = [
  { emoji: '🐱', word: 'CAT' }, { emoji: '🐶', word: 'DOG' },
  { emoji: '🐸', word: 'FROG' }, { emoji: '🌳', word: 'TREE' },
  { emoji: '🍎', word: 'APPLE' }, { emoji: '🚗', word: 'CAR' },
  { emoji: '🏠', word: 'HOUSE' }, { emoji: '⭐', word: 'STAR' },
  { emoji: '🌙', word: 'MOON' }, { emoji: '☀️', word: 'SUN' },
  { emoji: '🐟', word: 'FISH' }, { emoji: '🦋', word: 'BUTTERFLY' },
];

function makeQ() {
  const all = [...PAIRS].sort(() => Math.random() - 0.5);
  const target = all[0];
  const opts = [target.word];
  for (const p of all.slice(1)) {
    if (opts.length >= 4) break;
    opts.push(p.word);
  }
  opts.sort(() => Math.random() - 0.5);
  return { target, opts };
}

export default function WordMatch({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(w => {
    if (chosen) return;
    setChosen(w);
    if (w === q.target.word) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>What word matches this picture?</p>
      <div style={{ fontSize: '5rem', margin: '1rem 0' }}>{q.target.emoji}</div>
      <div className={styles.choices}>
        {q.opts.map(w => (
          <button
            key={w}
            className={`${styles.choice} ${chosen ? (w === q.target.word ? styles.correct : w === chosen ? styles.wrong : '') : ''}`}
            onClick={() => pick(w)}
          >{w}</button>
        ))}
      </div>
    </div>
  );
}
