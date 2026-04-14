import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/gamesRegistry';
import styles from './Home.module.css';

function Home() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span>Fun</span> Learning<br />for Every Kid!
            </h1>
            <p className={styles.heroSub}>
              Explore hundreds of free educational games in Math, Letters &amp; Logic.
              No apps, no downloads — just click and play!
            </p>
            <Link to="/games" className={styles.heroCta}>
              🎮 Start Playing!
            </Link>
          </div>
          <div className={styles.heroIllustration}>
            <div className={styles.floatEmoji} style={{ fontSize: '5rem', animationDelay: '0s' }}>🎲</div>
            <div className={styles.floatEmoji} style={{ fontSize: '4rem', animationDelay: '0.4s' }}>📚</div>
            <div className={styles.floatEmoji} style={{ fontSize: '4.5rem', animationDelay: '0.8s' }}>⭐</div>
            <div className={styles.floatEmoji} style={{ fontSize: '3.5rem', animationDelay: '1.2s' }}>🚀</div>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Choose a Subject</h2>
        <div className={styles.catGrid}>
          {Object.values(CATEGORIES).map(cat => (
            <Link
              key={cat.id}
              to={`/games?cat=${cat.id}`}
              className={styles.catCard}
              style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
            >
              <span className={styles.catEmoji}>{cat.emoji}</span>
              <h3 className={styles.catName}>{cat.label}</h3>
              <p className={styles.catDesc}>{cat.description}</p>
              <span className={styles.catArrow}>Play now →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howIt}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          {[
            { icon: '👆', title: 'Choose a game', desc: 'Pick any subject you like!' },
            { icon: '🎮', title: 'Play & Learn', desc: 'Have fun with interactive challenges.' },
            { icon: '🏆', title: 'Earn points', desc: 'Score high and beat your record!' },
          ].map(s => (
            <div key={s.title} className={styles.step}>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h4 className={styles.stepTitle}>{s.title}</h4>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
