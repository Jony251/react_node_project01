import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const SHAPES = ['🔴','🟡','🔵','🟢','🟠','🟣'];
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const shape = SHAPES[rand(0, SHAPES.length - 1)];
  const count = rand(2, 12);
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({ top: rand(5, 80), left: rand(5, 80) });
  }
  const decoys = rand(1, 5);
  const decoyShape = SHAPES.filter(s => s !== shape)[rand(0, SHAPES.length - 2)];
  for (let i = 0; i < decoys; i++) {
    positions.push({ top: rand(5, 80), left: rand(5, 80), decoy: true });
  }
  const opts = new Set([count]);
  while (opts.size < 4) opts.add(rand(Math.max(1, count - 5), count + 5));
  return { shape, decoyShape, count, positions, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export default function ShapeCount({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen !== null) return;
    setChosen(opt);
    if (opt === q.count) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Count the {q.shape} shapes!</p>
      <div style={{ position: 'relative', height: 180, background: '#f9fafb', borderRadius: 16, marginBottom: '1.2rem', overflow: 'hidden', border: '2px solid #e0e0e0' }}>
        {q.positions.map((pos, i) => (
          <span
            key={i}
            style={{ position: 'absolute', top: `${pos.top}%`, left: `${pos.left}%`, fontSize: '1.8rem', userSelect: 'none' }}
          >
            {pos.decoy ? q.decoyShape : q.shape}
          </span>
        ))}
      </div>
      <div className={styles.choices}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen !== null ? (o === q.count ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
