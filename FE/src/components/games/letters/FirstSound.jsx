import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const ITEMS = [
  { emoji: '🍎', word: 'Apple', letter: 'A' },
  { emoji: '🐦', word: 'Bird', letter: 'B' },
  { emoji: '🐱', word: 'Cat', letter: 'C' },
  { emoji: '🐶', word: 'Dog', letter: 'D' },
  { emoji: '🥚', word: 'Egg', letter: 'E' },
  { emoji: '🐸', word: 'Frog', letter: 'F' },
  { emoji: '🍇', word: 'Grape', letter: 'G' },
  { emoji: '🏠', word: 'House', letter: 'H' },
  { emoji: '🍦', word: 'Ice cream', letter: 'I' },
  { emoji: '🃏', word: 'Joker', letter: 'J' },
  { emoji: '🦁', word: 'Lion', letter: 'L' },
  { emoji: '🌙', word: 'Moon', letter: 'M' },
  { emoji: '🌰', word: 'Nut', letter: 'N' },
  { emoji: '🐙', word: 'Octopus', letter: 'O' },
  { emoji: '🐧', word: 'Penguin', letter: 'P' },
  { emoji: '👸', word: 'Queen', letter: 'Q' },
  { emoji: '🌈', word: 'Rainbow', letter: 'R' },
  { emoji: '⭐', word: 'Star', letter: 'S' },
  { emoji: '🐯', word: 'Tiger', letter: 'T' },
  { emoji: '☂️', word: 'Umbrella', letter: 'U' },
];

function makeQ() {
  const pool = [...ITEMS].sort(() => Math.random() - 0.5);
  const target = pool[0];
  const wrongs = pool.slice(1, 4).map(x => x.letter);
  const opts = [target.letter, ...wrongs].sort(() => Math.random() - 0.5);
  return { target, opts };
}

export default function FirstSound({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.target.letter) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>What letter does <strong>{q.target.word}</strong> start with?</p>
      <div style={{ fontSize: '5rem', margin: '0.5rem 0 1.2rem' }}>{q.target.emoji}</div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen ? (o === q.target.letter ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '2.2rem', width: 76, height: 76 }}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
