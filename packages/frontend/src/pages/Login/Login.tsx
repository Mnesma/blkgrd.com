import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginButton } from "../../components/auth/LoginButton";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export function Login() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate("/");
        }
    }, [isAuthenticated, isLoading, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Sign In</h1>

                <p className={styles.description}>
                    Connect with your Discord account to continue
                </p>

                <LoginButton />

                <p className={styles.note}>
                    Only members of our Discord server can sign in
                </p>
            </div>
        </div>
    );
}
