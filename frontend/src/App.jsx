import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Services from "./pages/Services";
import Alerts from "./pages/Alerts";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar />

                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/logs"
                            element={<Logs />}
                        />

                        <Route
                            path="/services"
                            element={<Services />}
                        />

                        <Route
                            path="/alerts"
                            element={<Alerts />}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;