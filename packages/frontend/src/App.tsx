import { Route, Routes } from "react-router";
import { Layout } from "./components/common/Layout";
import { AuthError } from "./pages/AuthError";
import { Home } from "./pages/Home";
import { JoinServer } from "./pages/JoinServer";
import { Login } from "./pages/Login";

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth-error" element={<AuthError />} />
                <Route path="/join-server" element={<JoinServer />} />
            </Routes>
        </Layout>
    );
}

export default App;
