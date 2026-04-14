import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const WORDS = ['APPLE','CLOUD','DREAM','FROG','GRAPE','HOUSE','JUICE','KITE','LEMON','MAGIC',
  'NIGHT','OCEAN','PIANO','QUEEN','RIVER','STONE','TIGER','UNCLE','VIOLET','WATER'];

const MAX_WRONG = 6;

function makeQ() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return { word, guessed: new Set(), wrong: [] };
}

export default function WordBuilder({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [guessed, setGuessed] = useState(new Set());
  const [wrong, setWrong] = useState([]);
  const [done, setDone] = useState(null);

  const guess = useCallback(letter => {
    if (done || guessed.has(letter) || wrong.includes(letter)) return;
    if (q.word.includes(letter)) {
      const next = new Set(guessed);
      next.add(letter);
      setGuessed(next);
      if ([...q.word].every(l => next.has(l))) {
        onScore(20);
        setDone('win');
        setTimeout(() => { setQ(makeQ()); setGuessed(new Set()); setWrong([]); setDone(null); }, 1500);
      }
    } else {
      const nw = [...wrong, letter];
      setWrong(nw);
      if (nw.length >= MAX_WRONG) {
        setDone('lose');
        setTimeout(() => { setQ(makeQ()); setGuessed(new Set()); setWrong([]); setDone(null); }, 1500);
      }
    }
  }, [done, guessed, wrong, q, onScore]);

  const display = q.word.split('').map(l => (guessed.has(l) ? l : '_'));
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className={styles.game}>
      <p className={styles.question}>Guess the hidden word!</p>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', margin: '1rem 0', flexWrap: 'wrap' }}>
        {display.map((l, i) => (
          <span key={i} style={{
            fontSize: '2rem', fontWeight: 900, minWidth: 44, height: 52,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            borderBottom: '4px solid #4ecdc4', padding: '0 4px',
          }}>{l === '_' ? '\u00A0' : l}</span>
        ))}
      </div>
      <p style={{ color: '#e74c3c', fontWeight: 800, marginBottom: '0.5rem' }}>
        ❌ Wrong: {wrong.join(', ')} ({MAX_WRONG - wrong.length} left)
      </p>
      {done && (
        <p style={{ fontSize: '1.4rem', fontWeight: 900, color: done === 'win' ? '#2ecc71' : '#e74c3c', margin: '0.5rem 0' }}>
          {done === 'win' ? '🎉 You got it!' : `😢 It was "${q.word}"`}
        </p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginTop: '0.8rem' }}>
        {ALPHA.map(l => (
          <button
            key={l}
            onClick={() => guess(l)}
            disabled={guessed.has(l) || wrong.includes(l) || !!done}
            style={{
              width: 38, height: 38, borderRadius: 8, border: '2px solid',
              fontSize: '0.95rem', fontWeight: 800,
              background: guessed.has(l) ? '#d4f8e8' : wrong.includes(l) ? '#ffe0e0' : '#f0f4ff',
              borderColor: guessed.has(l) ? '#2ecc71' : wrong.includes(l) ? '#e74c3c' : '#c5d0ff',
              cursor: (guessed.has(l) || wrong.includes(l) || done) ? 'default' : 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >{l}</button>
        ))}
      </div>
    </div>
  );
}
