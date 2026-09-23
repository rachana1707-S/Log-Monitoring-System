import {BrowserRouter,Route,Routes} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import LiveLogs from "./pages/LiveLogs";
import Alerts from "./pages/Alerts";
import Services from "./pages/Services";
import TraceDetails from "./pages/TraceDetails";

import "./App.css";

function App(){
    return(
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar/>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/logs" element={<Logs/>}/>
                        <Route path="/live" element={<LiveLogs/>}/>
                        <Route path="/alerts" element={<Alerts/>}/>
                        <Route path="/services" element={<Services/>}/>
                        <Route
                            path="/traces/:traceId"
                            element={<TraceDetails/>}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;