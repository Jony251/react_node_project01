import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../../data/gamesRegistry';
import styles from './GameHub.module.css';

function GameCard({ game }) {
  const cat = CATEGORIES[game.category];
  return (
    <Link
      to={`/play/${game.id}`}
      className={styles.card}
      style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
    >
      <div className={styles.cardEmoji}>{game.emoji}</div>
      <div className={styles.cardBody}>
        <span className={styles.cardCat} style={{ background: cat.color }}>
          {cat.emoji} {cat.label}
        </span>
        <h3 className={styles.cardTitle}>{game.title}</h3>
        <p className={styles.cardDesc}>{game.description}</p>
        <span className={styles.cardAge}>Ages {game.ageMin}+</span>
      </div>
      <div className={styles.cardPlay}>▶ Play</div>
    </Link>
  );
}

function GameHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const activeCat = searchParams.get('cat') || 'all';

  const filtered = useMemo(() => {
    return GAMES.filter(g => {
      const catMatch = activeCat === 'all' || g.category === activeCat;
      const q = search.toLowerCase();
      const textMatch =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [activeCat, search]);

  const setCat = cat => {
    setSearchParams(cat === 'all' ? {} : { cat });
    setSearch('');
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
          >
            🌟 All
          </button>
          {Object.values(CATEGORIES).map(cat => (
            <button
              key={cat.id}
              className={`${styles.tab} ${activeCat === cat.id ? styles.activeTab : ''}`}
              style={activeCat === cat.id ? { background: cat.color, borderColor: cat.color } : { '--hover': cat.color }}
              onClick={() => setCat(cat.id)}
            >
              {cat.emoji} {cat.label}
            </button>
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

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No games found. Try a different search!</p>
        ) : (
          filtered.map(g => <GameCard key={g.id} game={g} />)
        )}
      </div>
    </main>
  );
}

export default GameHub;
