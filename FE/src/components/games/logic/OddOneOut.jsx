import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const GROUPS = [
  { items: ['🐱', '🐶', '🐸', '🚗'], odd: '🚗', reason: 'not an animal' },
  { items: ['🍎', '🍊', '🍋', '🥕'], odd: '🥕', reason: 'not a fruit' },
  { items: ['🔴', '🔵', '🟡', '🐟'], odd: '🐟', reason: 'not a colour' },
  { items: ['✏️', '📏', '📐', '🍕'], odd: '🍕', reason: 'not a school tool' },
  { items: ['🌊', '🏔️', '🌳', '🏠'], odd: '🏠', reason: 'not nature' },
  { items: ['🚗', '🚌', '🚂', '🦁'], odd: '🦁', reason: 'not a vehicle' },
  { items: ['1', '3', '7', '4'], odd: '4', reason: 'not odd number' },
  { items: ['🌍', '🌎', '🌏', '🌙'], odd: '🌙', reason: 'not a planet/Earth' },
];

function makeQ() {
  const g = GROUPS[Math.floor(Math.random() * GROUPS.length)];
  return { ...g, shuffled: [...g.items].sort(() => Math.random() - 0.5) };
}

export default function OddOneOut({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(item => {
    if (chosen) return;
    setChosen(item);
    if (item === q.odd) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Which one does NOT belong?</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        {q.shuffled.map((item, i) => (
          <button
            key={i}
            onClick={() => pick(item)}
            className={`${styles.choice} ${chosen ? (item === q.odd ? styles.correct : item === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '2.5rem', width: 90, height: 90 }}
          >{item}</button>
        ))}
      </div>
      {chosen && (
        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#888' }}>
          {chosen === q.odd ? `✅ Correct! "${q.odd}" is ${q.reason}.` : `❌ The odd one was "${q.odd}" (${q.reason}).`}
        </p>
      )}
    </div>
  );
}
