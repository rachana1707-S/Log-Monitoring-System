import {useCallback,useEffect,useState} from "react";
import {
    FiActivity,
    FiAlertCircle,
    FiAlertTriangle,
    FiDatabase,
    FiRefreshCw,
    FiServer,
    FiTrendingUp
} from "react-icons/fi";

import {getLogs} from "../api/logApi";
import {getAnalytics} from "../api/analyticsApi";

import MetricCard from "../components/MetricCard";
import LogTable from "../components/LogTable";
import LogsOverTimeChart from "../components/LogsOverTimeChart";
import SeverityChart from "../components/SeverityChart";
import ServiceActivityChart from "../components/ServiceActivityChart";

const Dashboard=()=>{
    const [logs,setLogs]=useState([]);
    const [analytics,setAnalytics]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const loadDashboard=useCallback(async()=>{
        try{
            setLoading(true);

            const [logsData,analyticsData]=await Promise.all([
                getLogs(),
                getAnalytics()
            ]);

            setLogs(logsData);
            setAnalytics(analyticsData);
            setError("");
        }catch(err){
            console.error(err);
            setError("Unable to load dashboard data.");
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        loadDashboard();
    },[loadDashboard]);

    const recentLogs=[...logs]
        .sort((first,second)=>
            new Date(second.timestamp)-new Date(first.timestamp)
        )
        .slice(0,10);

    const errorRate=analytics?.errorRate??0;

    return(
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-label dashboard-page-label">
                        <FiActivity/>
                        <span>OVERVIEW</span>
                    </div>

                    <h1>Dashboard</h1>

                    <p>
                        Monitor application activity, service health and log
                        analytics from one place.
                    </p>
                </div>

                <button
                    className="primary-button refresh-button"
                    onClick={loadDashboard}
                    disabled={loading}
                >
                    <FiRefreshCw className={loading?"spin":""}/>
                    {loading?"Refreshing...":"Refresh"}
                </button>
            </div>

            {error&&(
                <div className="error-message dashboard-error">
                    <FiAlertCircle/>
                    <div>
                        <strong>Dashboard unavailable</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="metrics-grid">
                <MetricCard
                    title="Total Logs"
                    value={analytics?.totalLogs??0}
                    icon={<FiDatabase/>}
                    type="primary"
                    subtitle="Events indexed"
                />

                <MetricCard
                    title="Errors"
                    value={analytics?.errorCount??0}
                    icon={<FiAlertCircle/>}
                    type="error"
                    subtitle="Requires attention"
                />

                <MetricCard
                    title="Warnings"
                    value={analytics?.warningCount??0}
                    icon={<FiAlertTriangle/>}
                    type="warning"
                    subtitle="Potential issues"
                />

                <MetricCard
                    title="Active Services"
                    value={analytics?.serviceCount??0}
                    icon={<FiServer/>}
                    type="service"
                    subtitle="Sending telemetry"
                />
            </div>

            <div className="analytics-grid">
                <LogsOverTimeChart
                    data={analytics?.logsOverTime||[]}
                />

                <SeverityChart
                    data={analytics?.severityDistribution||{}}
                />
            </div>

            <div className="analytics-bottom-grid">
                <ServiceActivityChart
                    data={analytics?.serviceDistribution||{}}
                />

                <div className="error-rate-card">
                    <div className="error-rate-header">
                        <div className="error-rate-icon">
                            <FiTrendingUp/>
                        </div>

                        <div>
                            <p>ERROR RATE</p>
                            <span>Current log health</span>
                        </div>
                    </div>

                    <div className="error-rate-value">
                        <h2>{errorRate.toFixed(1)}%</h2>

                        <span
                            className={
                                errorRate>20
                                    ?"rate-status critical"
                                    :errorRate>10
                                    ?"rate-status warning"
                                    :"rate-status healthy"
                            }
                        >
                            {errorRate>20
                                ?"High"
                                :errorRate>10
                                ?"Elevated"
                                :"Healthy"}
                        </span>
                    </div>

                    <div className="error-rate-bar">
                        <div
                            style={{
                                width:`${Math.min(errorRate,100)}%`
                            }}
                        ></div>
                    </div>

                    <div className="error-rate-footer">
                        <FiAlertCircle/>
                        <span>
                            Percentage of received logs marked as ERROR
                        </span>
                    </div>
                </div>
            </div>

            <section className="dashboard-section">
                <div className="section-header">
                    <div className="section-title-group">
                        <div className="section-icon">
                            <FiDatabase/>
                        </div>

                        <div>
                            <h2>Recent Logs</h2>
                            <p>Latest events received by LogPulse</p>
                        </div>
                    </div>

                    <span className="live-indicator">
                        <span></span>
                        Connected
                    </span>
                </div>

                {loading?(
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Loading dashboard...</p>
                    </div>
                ):recentLogs.length===0?(
                    <div className="dashboard-empty-state">
                        <div className="empty-state-icon">
                            <FiDatabase/>
                        </div>

                        <h3>No logs received yet</h3>

                        <p>
                            Logs will appear here after applications start
                            sending events to LogPulse.
                        </p>
                    </div>
                ):(
                    <LogTable logs={recentLogs}/>
                )}
            </section>
        </div>
    );
};

export default Dashboard;