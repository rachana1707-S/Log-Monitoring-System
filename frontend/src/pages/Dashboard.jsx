import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    FiAlertCircle,
    FiAlertTriangle,
    FiDatabase,
    FiRefreshCw,
    FiServer
} from "react-icons/fi";

import { getLogs } from "../api/logApi";
import { getAnalytics } from "../api/analyticsApi";

import MetricCard from "../components/MetricCard";
import LogTable from "../components/LogTable";
import LogsOverTimeChart from "../components/LogsOverTimeChart";
import SeverityChart from "../components/SeverityChart";
import ServiceActivityChart from "../components/ServiceActivityChart";

const Dashboard = () => {

    const [logs, setLogs] =
        useState([]);

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadDashboard = useCallback(
        async () => {

            try {

                setLoading(true);

                const [
                    logsData,
                    analyticsData
                ] = await Promise.all([
                    getLogs(),
                    getAnalytics()
                ]);

                setLogs(logsData);

                setAnalytics(
                    analyticsData
                );

                setError("");

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }
        },
        []
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const recentLogs = [...logs]
        .sort(
            (first, second) =>
                new Date(
                    second.timestamp
                ) -
                new Date(
                    first.timestamp
                )
        )
        .slice(0, 10);

    return (
        <div className="page">

            <div className="page-header">

                <div>

                    <div className="page-label">
                        OVERVIEW
                    </div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Monitor application activity,
                        service health and log
                        analytics from one place.
                    </p>

                </div>

                <button
                    className=
                        "primary-button refresh-button"
                    onClick={loadDashboard}
                    disabled={loading}
                >

                    <FiRefreshCw
                        className={
                            loading
                                ? "spin"
                                : ""
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
                    value={
                        analytics
                            ?.totalLogs ?? 0
                    }
                    icon={
                        <FiDatabase />
                    }
                    type="primary"
                />

                <MetricCard
                    title="Errors"
                    value={
                        analytics
                            ?.errorCount ?? 0
                    }
                    icon={
                        <FiAlertCircle />
                    }
                    type="error"
                />

                <MetricCard
                    title="Warnings"
                    value={
                        analytics
                            ?.warningCount ?? 0
                    }
                    icon={
                        <FiAlertTriangle />
                    }
                    type="warning"
                />

                <MetricCard
                    title="Active Services"
                    value={
                        analytics
                            ?.serviceCount ?? 0
                    }
                    icon={
                        <FiServer />
                    }
                    type="service"
                />

            </div>

            <div className="analytics-grid">

                <LogsOverTimeChart
                    data={
                        analytics
                            ?.logsOverTime
                        || []
                    }
                />

                <SeverityChart
                    data={
                        analytics
                            ?.severityDistribution
                        || {}
                    }
                />

            </div>

            <div className="analytics-bottom-grid">

                <ServiceActivityChart
                    data={
                        analytics
                            ?.serviceDistribution
                        || {}
                    }
                />

                <div className="error-rate-card">

                    <div>
                        <p>
                            ERROR RATE
                        </p>

                        <h2>
                            {(
                                analytics
                                    ?.errorRate
                                ?? 0
                            ).toFixed(1)}
                            %
                        </h2>
                    </div>

                    <div className="error-rate-bar">

                        <div
                            style={{
                                width:
                                    `${Math.min(
                                        analytics
                                            ?.errorRate
                                        ?? 0,
                                        100
                                    )}%`
                            }}
                        ></div>

                    </div>

                    <span>
                        Percentage of received
                        logs marked as ERROR
                    </span>

                </div>

            </div>

            <section className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Recent Logs
                        </h2>

                        <p>
                            Latest events received
                            by LogPulse
                        </p>

                    </div>

                    <span className="live-indicator">

                        <span></span>

                        Connected

                    </span>

                </div>

                {loading ? (

                    <div className="loading-state">

                        <div className="loader">
                        </div>

                        <p>
                            Loading dashboard...
                        </p>

                    </div>

                ) : (

                    <LogTable
                        logs={recentLogs}
                    />

                )}

            </section>

        </div>
    );
};

export default Dashboard;