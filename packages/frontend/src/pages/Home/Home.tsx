import { useAuth } from '../../context/AuthContext';
import { LoginButton } from '../../components/auth/LoginButton';
import styles from './Home.module.css';

export function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.accent}>BLKGRD</span>
        </h1>
        <p className={styles.subtitle}>
          Your Discord community companion
        </p>

        {isAuthenticated && user ? (
          <div className={styles.welcomeCard}>
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className={styles.welcomeAvatar}
            />
            <div className={styles.welcomeInfo}>
              <span className={styles.welcomeGreeting}>Welcome back,</span>
              <span className={styles.welcomeName}>{user.displayName}</span>
            </div>
          </div>
        ) : (
          <div className={styles.cta}>
            <p className={styles.ctaText}>
              Sign in with Discord to access member features
            </p>
            <LoginButton />
          </div>
        )}
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔐</div>
          <h3 className={styles.featureTitle}>Discord Integration</h3>
          <p className={styles.featureDescription}>
            Login securely with your Discord account. Only server members can access the site.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>👥</div>
          <h3 className={styles.featureTitle}>Community Hub</h3>
          <p className={styles.featureDescription}>
            Connect with fellow community members and stay up to date.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>⚡</div>
          <h3 className={styles.featureTitle}>More Coming Soon</h3>
          <p className={styles.featureDescription}>
            This is just the beginning. More features are on the way!
          </p>
        </div>
      </section>
    </div>
  );
}

