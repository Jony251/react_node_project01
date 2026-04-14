import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const FRACTIONS = [
  { label: '½', num: 1, den: 2 },
  { label: '⅓', num: 1, den: 3 },
  { label: '¼', num: 1, den: 4 },
  { label: '¾', num: 3, den: 4 },
  { label: '⅔', num: 2, den: 3 },
  { label: '⅕', num: 1, den: 5 },
];

function PizzaSlice({ num, den, highlight }) {
  const size = 120;
  const cx = size / 2, cy = size / 2, r = 52;
  const slices = [];
  for (let i = 0; i < den; i++) {
    const startAngle = (i / den) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = (1 / den) > 0.5 ? 1 : 0;
    slices.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={i < num ? (highlight ? '#ff6b35' : '#ffb393') : '#f0f0f0'}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  }
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ccc" strokeWidth={2} />
      {slices}
    </svg>
  );
}

function makeQ() {
  const correct = FRACTIONS[Math.floor(Math.random() * FRACTIONS.length)];
  const pool = FRACTIONS.filter(f => f.label !== correct.label);
  const opts = [correct];
  while (opts.length < 4) {
    const f = pool[Math.floor(Math.random() * pool.length)];
    if (!opts.find(o => o.label === f.label)) opts.push(f);
  }
  opts.sort(() => Math.random() - 0.5);
  return { correct, opts };
}

export default function FractionFinder({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(f => {
    if (chosen) return;
    setChosen(f);
    if (f.label === q.correct.label) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1300);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Which pizza shows <strong>{q.correct.label}</strong>?</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        {q.opts.map(f => (
          <button
            key={f.label}
            onClick={() => pick(f)}
            style={{
              background: chosen ? (f.label === q.correct.label ? '#d4f8e8' : f.label === chosen?.label ? '#ffe0e0' : '#fafafa') : '#fafafa',
              border: '3px solid',
              borderColor: chosen ? (f.label === q.correct.label ? '#2ecc71' : f.label === chosen?.label ? '#e74c3c' : '#e0e0e0') : '#e0e0e0',
              borderRadius: 16,
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <PizzaSlice num={f.num} den={f.den} highlight={f.label === q.correct.label && chosen} />
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
