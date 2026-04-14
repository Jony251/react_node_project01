import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const WORDS = [
  { emoji: '🐱', word: 'CAT' }, { emoji: '🐶', word: 'DOG' },
  { emoji: '🌳', word: 'TREE' }, { emoji: '🍎', word: 'APPLE' },
  { emoji: '🚗', word: 'CAR' }, { emoji: '⭐', word: 'STAR' },
  { emoji: '🌙', word: 'MOON' }, { emoji: '🐟', word: 'FISH' },
  { emoji: '🦁', word: 'LION' }, { emoji: '🏠', word: 'HOUSE' },
];

function scramble(w) {
  const arr = w.split('');
  do { arr.sort(() => Math.random() - 0.5); } while (arr.join('') === w);
  return arr.join('');
}

function makeQ() {
  const item = WORDS[Math.floor(Math.random() * WORDS.length)];
  return { ...item, scrambled: scramble(item.word) };
}

export default function WordScramble({ onScore }) {
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
      <p className={styles.question}>Unscramble the word!</p>
      <div style={{ fontSize: '4rem', margin: '0.5rem 0' }}>{q.emoji}</div>
      <p style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '8px', color: '#9b59b6', margin: '0.5rem 0 1.2rem' }}>
        {q.scrambled}
      </p>
      <input
        className={styles.input}
        style={{ width: 180, textTransform: 'uppercase' }}
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
