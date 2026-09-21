import {NavLink} from "react-router-dom";
import {
    FiActivity,
    FiAlertTriangle,
    FiBarChart2,
    FiDatabase,
    FiRadio,
    FiServer
} from "react-icons/fi";

const Sidebar=()=>{
    return(
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="logo">
                    <div className="logo-icon">
                        <FiActivity/>
                    </div>

                    <div className="logo-content">
                        <span className="logo-text">LogPulse</span>
                        <span className="logo-subtitle">OBSERVABILITY</span>
                    </div>
                </div>

                <div className="sidebar-section-title">
                    MONITORING
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        end
                        className={({isActive})=>isActive?"active":""}
                    >
                        <div className="nav-icon">
                            <FiBarChart2/>
                        </div>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/logs"
                        className={({isActive})=>isActive?"active":""}
                    >
                        <div className="nav-icon">
                            <FiDatabase/>
                        </div>
                        <span>Log Explorer</span>
                    </NavLink>

                    <NavLink
                        to="/live"
                        className={({isActive})=>isActive?"active":""}
                    >
                        <div className="nav-icon">
                            <FiRadio/>
                        </div>
                        <span>Live Logs</span>
                    </NavLink>

                    <NavLink
                        to="/services"
                        className={({isActive})=>isActive?"active":""}
                    >
                        <div className="nav-icon">
                            <FiServer/>
                        </div>
                        <span>Services</span>
                    </NavLink>

                    <NavLink
                        to="/alerts"
                        className={({isActive})=>isActive?"active":""}
                    >
                        <div className="nav-icon">
                            <FiAlertTriangle/>
                        </div>
                        <span>Alerts</span>
                    </NavLink>
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="system-status">
                    <span className="status-dot"></span>

                    <div className="status-content">
                        <p>System Online</p>
                        <small>All services operational</small>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;