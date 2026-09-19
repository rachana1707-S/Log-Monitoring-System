import { useEffect, useState } from "react";

import {
    FiAlertCircle,
    FiAlertTriangle,
    FiDatabase,
    FiRefreshCw,
    FiServer
} from "react-icons/fi";

import { getLogs } from "../api/logApi";

import MetricCard from "../components/MetricCard";
import LogTable from "../components/LogTable";

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);

            const data = await getLogs();

            setLogs(data);
            setError("");
        } catch (err) {
            console.error(err);

            setError(
                "Unable to connect to the LogPulse backend."
            );
        } finally {
            setLoading(false);
        }
    };

    const errorCount = logs.filter(
        (log) => log.level === "ERROR"
    ).length;

    const warningCount = logs.filter(
        (log) => log.level === "WARN"
    ).length;

    const serviceCount = new Set(
        logs
            .map((log) => log.service)
            .filter(Boolean)
    ).size;

    const recentLogs = [...logs]
        .sort(
            (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
        )
        .slice(0, 10);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        OVERVIEW
                    </div>

                    <h1>Dashboard</h1>

                    <p>
                        Monitor application activity and
                        service health from one place.
                    </p>
                </div>

                <button
                    className="primary-button refresh-button"
                    onClick={loadLogs}
                    disabled={loading}
                >
                    <FiRefreshCw
                        className={
                            loading ? "spin" : ""
                        }
                    />

                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <FiAlertCircle />
                    {error}
                </div>
            )}

            <div className="metrics-grid">
                <MetricCard
                    title="Total Logs"
                    value={logs.length}
                    icon={<FiDatabase />}
                    type="primary"
                />

                <MetricCard
                    title="Errors"
                    value={errorCount}
                    icon={<FiAlertCircle />}
                    type="error"
                />

                <MetricCard
                    title="Warnings"
                    value={warningCount}
                    icon={<FiAlertTriangle />}
                    type="warning"
                />

                <MetricCard
                    title="Active Services"
                    value={serviceCount}
                    icon={<FiServer />}
                    type="service"
                />
            </div>

            <section className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>Recent Logs</h2>

                        <p>
                            Latest events received by LogPulse
                        </p>
                    </div>

                    <span className="live-indicator">
                        <span></span>
                        Connected
                    </span>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Loading logs...</p>
                    </div>
                ) : (
                    <LogTable logs={recentLogs} />
                )}
            </section>
        </div>
    );
};

export default Dashboard;