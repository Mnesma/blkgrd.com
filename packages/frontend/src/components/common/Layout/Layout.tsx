import { ReactNode } from "react";
import { useAuth } from "../../../context/AuthContext";
import { LoginButton } from "../../auth/LoginButton";
import { UserMenu } from "../../auth/UserMenu";
import styles from "./Layout.module.css";

type LayoutProps = {
    children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <a href="/" className={styles.logo}>
                        <span className={styles.logoText}>BLKGRD</span>
                    </a>

                    <nav className={styles.nav}>
                        {isLoading
                            ? <div className={styles.skeleton} />
                            : isAuthenticated
                            ? <UserMenu />
                            : <LoginButton />}
                    </nav>
                </div>
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <span className={styles.footerText}>
                        © {new Date().getFullYear()} BLKGRD
                    </span>
                </div>
            </footer>
        </div>
    );
}
