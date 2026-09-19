import {
    FiActivity,
    FiAlertTriangle,
    FiDatabase,
    FiGrid,
    FiServer
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <FiActivity />
                <span>LogPulse</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" end>
                    <FiGrid />
                    Dashboard
                </NavLink>

                <NavLink to="/logs">
                    <FiDatabase />
                    Log Explorer
                </NavLink>

                <NavLink to="/services">
                    <FiServer />
                    Services
                </NavLink>

                <NavLink to="/alerts">
                    <FiAlertTriangle />
                    Alerts
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="system-status">
                    <span className="status-dot"></span>

                    <div>
                        <p>System Status</p>
                        <small>Operational</small>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;