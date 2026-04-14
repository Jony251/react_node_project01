import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const COLORS = [
  { label: 'Red', hex: '#e74c3c', items: ['🍎','🌹','🎈'] },
  { label: 'Blue', hex: '#3498db', items: ['💧','🐟','🦋'] },
  { label: 'Yellow', hex: '#f1c40f', items: ['⭐','🌻','🍋'] },
  { label: 'Green', hex: '#2ecc71', items: ['🍀','🐸','🌲'] },
];

function makeQ() {
  const colorIdx = Math.floor(Math.random() * COLORS.length);
  const color = COLORS[colorIdx];
  const item = color.items[Math.floor(Math.random() * color.items.length)];
  const opts = COLORS.map(c => c.label);
  return { item, ans: color.label, opts };
}

export default function ColorSort({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>What colour group does this belong to?</p>
      <div style={{ fontSize: '5rem', margin: '0.5rem 0 1.5rem' }}>{q.item}</div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {COLORS.map(c => (
          <button
            key={c.label}
            onClick={() => pick(c.label)}
            className={`${styles.choice} ${chosen ? (c.label === q.ans ? styles.correct : c.label === chosen ? styles.wrong : '') : ''}`}
            style={{ background: c.hex, color: '#fff', borderColor: c.hex, fontSize: '1rem', minWidth: 100 }}
          >{c.label}</button>
        ))}
      </div>
    </div>
  );
}
