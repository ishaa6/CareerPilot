import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import FlowPage from "./pages/FlowPage";
import HistoryPage from "./pages/HistoryPage";
import HistoryDetailPage from "./pages/HistoryDetailPage";

function navLinkClass({ isActive }) {
    return "nav-link" + (isActive ? " is-active" : "");
}

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <header className="app-header">
                    <NavLink className="brand" to="/">
                        <span>
                            <span className="brand-name">CareerPilot</span>
                        </span>
                    </NavLink>

                    <nav className="header-nav">
                        <NavLink to="/" end className={navLinkClass}>New analysis</NavLink>
                        <NavLink to="/history" className={navLinkClass}>History</NavLink>
                    </nav>
                </header>

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<FlowPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/history/:id" element={<HistoryDetailPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
