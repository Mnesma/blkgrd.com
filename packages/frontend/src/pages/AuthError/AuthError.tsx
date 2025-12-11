import { Link } from "react-router";
import styles from "./AuthError.module.css";

export function AuthError() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <svg
                        className={styles.icon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                <h1 className={styles.title}>Authentication Failed</h1>

                <p className={styles.description}>
                    Something went wrong during sign in. This can happen if your
                    session expired or the request was interrupted.
                </p>

                <Link to="/login" className={styles.button}>
                    Try Again
                </Link>
            </div>
        </div>
    );
}
