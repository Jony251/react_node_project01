import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const VOWELS = new Set('AEIOU');
const WORDS = ['APPLE','ORANGE','UMBRELLA','ELEPHANT','ISLAND','OPEN','UNIT','EAGLE','IGLOO','OASIS'];

function makeQ() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return { word, letters: word.split(''), vowelCount: [...word].filter(l => VOWELS.has(l)).length };
}

export default function VowelHunt({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [popped, setPopped] = useState(new Set());
  const [done, setDone] = useState(false);

  const pop = useCallback(i => {
    if (done || popped.has(i)) return;
    const letter = q.letters[i];
    if (VOWELS.has(letter)) {
      const next = new Set(popped);
      next.add(i);
      setPopped(next);
      const vowelIdxs = q.letters.map((l, idx) => VOWELS.has(l) ? idx : -1).filter(x => x >= 0);
      if (vowelIdxs.every(idx => next.has(idx))) {
        onScore(15);
        setDone(true);
        setTimeout(() => { setQ(makeQ()); setPopped(new Set()); setDone(false); }, 1400);
      }
    }
  }, [done, popped, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Tap all the vowels (A E I O U)!</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', margin: '1.2rem 0' }}>
        {q.letters.map((l, i) => {
              const isPoped = popped.has(i);
          return (
            <button
              key={i}
              onClick={() => pop(i)}
              style={{
                fontSize: '2rem', fontWeight: 900,
                width: 60, height: 60,
                border: '3px solid',
                borderColor: isPoped ? '#2ecc71' : '#b3d7ff',
                borderRadius: 12,
                background: isPoped ? '#d4f8e8' : '#e8f4ff',
                cursor: isPoped ? 'default' : 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-family)',
                transform: isPoped ? 'scale(0.88)' : 'scale(1)',
              }}
            >{l}</button>
          );
        })}
      </div>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        {popped.size} / {q.vowelCount} vowels found
      </p>
    </div>
  );
}
