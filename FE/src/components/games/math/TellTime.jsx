import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function ClockFace({ hours, minutes }) {
  const size = 160, cx = 80, cy = 80, r = 70;
  const hourAngle = ((hours % 12) / 12 + minutes / 720) * 2 * Math.PI - Math.PI / 2;
  const minAngle = (minutes / 60) * 2 * Math.PI - Math.PI / 2;
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#333" strokeWidth={4} />
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        return (
          <text
            key={i}
            x={cx + 56 * Math.cos(a)}
            y={cy + 56 * Math.sin(a) + 4}
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            fill="#444"
          >{i === 0 ? 12 : i}</text>
        );
      })}
      <line x1={cx} y1={cy} x2={cx + 38 * Math.cos(hourAngle)} y2={cy + 38 * Math.sin(hourAngle)} stroke="#333" strokeWidth={5} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + 55 * Math.cos(minAngle)} y2={cy + 55 * Math.sin(minAngle)} stroke="#555" strokeWidth={3} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill="#333" />
    </svg>
  );
}

function makeQ() {
  const h = rand(1, 12);
  const mChoices = [0, 15, 30, 45];
  const m = mChoices[rand(0, 3)];
  const ans = `${h}:${m.toString().padStart(2, '0')}`;
  const opts = new Set([ans]);
  while (opts.size < 4) {
    const rh = rand(1, 12);
    const rm = mChoices[rand(0, 3)];
    opts.add(`${rh}:${rm.toString().padStart(2, '0')}`);
  }
  return { h, m, ans, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export default function TellTime({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>What time is it?</p>
      <ClockFace hours={q.h} minutes={q.m} />
      <div className={styles.choices} style={{ marginTop: '1.5rem' }}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen ? (o === q.ans ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
