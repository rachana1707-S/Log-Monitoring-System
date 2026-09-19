import { useEffect, useState } from "react";

import {
    FiAlertCircle,
    FiAlertTriangle,
    FiDatabase,
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

            setError("Unable to load logs from the server.");
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
        logs.map((log) => log.service)
    ).size;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Monitor your application logs and services.</p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadLogs}
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="metrics-grid">
                <MetricCard
                    title="Total Logs"
                    value={logs.length}
                    icon={<FiDatabase />}
                />

                <MetricCard
                    title="Errors"
                    value={errorCount}
                    icon={<FiAlertCircle />}
                />

                <MetricCard
                    title="Warnings"
                    value={warningCount}
                    icon={<FiAlertTriangle />}
                />

                <MetricCard
                    title="Services"
                    value={serviceCount}
                    icon={<FiServer />}
                />
            </div>

            <section className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2>Recent Logs</h2>
                        <p>Latest application activity</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">
                        Loading logs...
                    </div>
                ) : (
                    <LogTable logs={logs.slice(0, 10)} />
                )}
            </section>
        </div>
    );
};

export default Dashboard;