import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const WORDS = [
  { emoji: '🐱', word: 'CAT' }, { emoji: '🐶', word: 'DOG' },
  { emoji: '🐸', word: 'FROG' }, { emoji: '🌳', word: 'TREE' },
  { emoji: '🍎', word: 'APPLE' }, { emoji: '🚗', word: 'CAR' },
  { emoji: '🏠', word: 'HOUSE' }, { emoji: '⭐', word: 'STAR' },
  { emoji: '🌙', word: 'MOON' }, { emoji: '🐟', word: 'FISH' },
  { emoji: '🎈', word: 'BALL' }, { emoji: '🦁', word: 'LION' },
];

function makeQ() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function SpellIt({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [input, setInput] = useState('');
  const [fb, setFb] = useState('');

  const check = useCallback(() => {
    const correct = input.trim().toUpperCase() === q.word;
    setFb(correct ? '✅ Correct!' : `❌ It's "${q.word}"`);
    if (correct) onScore(10);
    setTimeout(() => { setQ(makeQ()); setInput(''); setFb(''); }, 1300);
  }, [input, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>How do you spell this?</p>
      <div style={{ fontSize: '5rem', margin: '0.5rem 0 1rem' }}>{q.emoji}</div>
      <input
        className={styles.input}
        style={{ width: 180, fontSize: '1.6rem', textTransform: 'uppercase' }}
        value={input}
        onChange={e => setInput(e.target.value.toUpperCase())}
        onKeyDown={e => e.key === 'Enter' && input && check()}
        maxLength={12}
        autoFocus
      />
      <br />
      <button className={styles.submitBtn} onClick={check} disabled={!input}>Check</button>
      <div className={`${styles.feedback} ${fb.startsWith('✅') ? styles.ok : fb ? styles.no : ''}`}>{fb}</div>
    </div>
  );
}
