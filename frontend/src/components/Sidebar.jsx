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
            <div className="sidebar-top">
                <div className="logo">
                    <div className="logo-icon">
                        <FiActivity />
                    </div>

                    <span className="logo-text">
                        LogPulse
                    </span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end>
                        <FiGrid />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/logs">
                        <FiDatabase />
                        <span>Log Explorer</span>
                    </NavLink>

                    <NavLink to="/services">
                        <FiServer />
                        <span>Services</span>
                    </NavLink>

                    <NavLink to="/alerts">
                        <FiAlertTriangle />
                        <span>Alerts</span>
                    </NavLink>
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="system-status">
                    <span className="status-dot"></span>

                    <div className="status-content">
                        <p>System Status</p>
                        <small>Operational</small>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;