import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GAMES, CATEGORIES, DIFFICULTIES } from '../../data/gamesRegistry';
import { useAuth } from '../../context/AuthContext';
import styles from './GameHub.module.css';

function GameCard({ game, locked }) {
  const cat = CATEGORIES[game.category];
  const diff = DIFFICULTIES[game.difficulty] ?? DIFFICULTIES.easy;

  return (
    <div className={`${styles.cardWrap} ${locked ? styles.locked : ''}`}>
      {locked && (
        <div className={styles.lockOverlay}>
          <span>👑</span>
          <span>Premium</span>
        </div>
      )}
      <Link
        to={locked ? '#' : `/play/${game.id}`}
        className={styles.card}
        style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
        onClick={locked ? e => e.preventDefault() : undefined}
        aria-disabled={locked}
      >
        <div className={styles.cardEmoji}>{game.emoji}</div>
        <div className={styles.cardBody}>
          <div className={styles.cardMeta}>
            <span className={styles.cardCat} style={{ background: cat.color }}>
              {cat.emoji} {cat.label}
            </span>
            <span className={styles.diffBadge} style={{ background: diff.color }}>
              {diff.emoji} {diff.label}
            </span>
          </div>
          <h3 className={styles.cardTitle}>{game.title}</h3>
          <p className={styles.cardDesc}>{game.description}</p>
          <span className={styles.cardAge}>Ages {game.ageMin}+</span>
        </div>
        <div className={styles.cardPlay} style={{ background: locked ? '#aaa' : cat.color }}>
          {locked ? '🔒 Premium' : '▶ Play'}
        </div>
      </Link>
    </div>
  );
}

function GameHub() {
  const { isPremium } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const activeCat  = searchParams.get('cat')  || 'all';
  const activeDiff = searchParams.get('diff') || 'all';

  const filtered = useMemo(() => {
    return GAMES.filter(g => {
      const catMatch  = activeCat === 'all'  || g.category === activeCat;
      const diffMatch = activeDiff === 'all' || g.difficulty === activeDiff;
      const q = search.toLowerCase();
      const textMatch = !q || g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
      return catMatch && diffMatch && textMatch;
    });
  }, [activeCat, activeDiff, search]);

  const setCat = cat => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('cat'); else next.set('cat', cat);
    setSearchParams(next);
    setSearch('');
  };

  const setDiff = diff => {
    const next = new URLSearchParams(searchParams);
    if (diff === 'all') next.delete('diff'); else next.set('diff', diff);
    setSearchParams(next);
  };

  return (
    <main className={styles.page}>
      <div className={styles.heroBar}>
        <h1 className={styles.heroTitle}>🎮 All Games</h1>
        <p className={styles.heroSub}>Pick a subject and start playing!</p>
      </div>

      <div className={styles.controls}>
        {/* Category tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeCat === 'all' ? styles.activeTab : ''}`}
            onClick={() => setCat('all')}
          >🌟 All</button>
          {Object.values(CATEGORIES).map(cat => (
            <button
              key={cat.id}
              className={`${styles.tab} ${activeCat === cat.id ? styles.activeTab : ''}`}
              style={activeCat === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
              onClick={() => setCat(cat.id)}
            >{cat.emoji} {cat.label}</button>
          ))}
        </div>

        {/* Difficulty tabs */}
        <div className={styles.diffRow}>
          <button
            className={`${styles.diffTab} ${activeDiff === 'all' ? styles.activeDiff : ''}`}
            onClick={() => setDiff('all')}
          >All</button>
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button
              key={key}
              className={`${styles.diffTab} ${activeDiff === key ? styles.activeDiff : ''}`}
              style={activeDiff === key ? { background: d.color, borderColor: d.color, color: '#fff' } : {}}
              onClick={() => setDiff(key)}
            >{d.emoji} {d.label}</button>
          ))}
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search games…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!isPremium && (
        <div className={styles.premiumBanner}>
          👑 <strong>Premium</strong> games are locked. <Link to="/profile">Upgrade</Link> to unlock all games!
        </div>
      )}

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No games found. Try a different search!</p>
        ) : (
          filtered.map(g => (
            <GameCard key={g.id} game={g} locked={g.isPremium && !isPremium} />
          ))
        )}
      </div>
    </main>
  );
}

export default GameHub;
