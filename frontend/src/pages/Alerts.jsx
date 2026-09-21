import {useCallback,useEffect,useState} from "react";
import {
    FiActivity,
    FiAlertCircle,
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiRefreshCw,
    FiServer
} from "react-icons/fi";

import {
    getAlerts,
    resolveAlert
} from "../api/alertApi";

const Alerts=()=>{
    const [alerts,setAlerts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [filter,setFilter]=useState("ALL");
    const [resolvingId,setResolvingId]=useState(null);

    const loadAlerts=useCallback(async()=>{
        try{
            setLoading(true);

            const data=await getAlerts();

            setAlerts(data);
            setError("");
        }catch(err){
            console.error(err);
            setError("Unable to load alerts.");
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        loadAlerts();
    },[loadAlerts]);

    const handleResolve=async(id)=>{
        try{
            setResolvingId(id);

            await resolveAlert(id);

            setAlerts(currentAlerts=>
                currentAlerts.map(alert=>
                    alert.id===id
                        ?{...alert,status:"RESOLVED"}
                        :alert
                )
            );

            setError("");
        }catch(err){
            console.error(err);
            setError("Unable to resolve alert.");
        }finally{
            setResolvingId(null);
        }
    };

    const filteredAlerts=alerts.filter(alert=>{
        if(filter==="ALL"){
            return true;
        }

        return alert.status===filter;
    });

    const activeCount=alerts.filter(
        alert=>alert.status==="ACTIVE"
    ).length;

    const criticalCount=alerts.filter(
        alert=>
            alert.status==="ACTIVE"&&
            alert.severity==="CRITICAL"
    ).length;

    const highCount=alerts.filter(
        alert=>
            alert.status==="ACTIVE"&&
            alert.severity==="HIGH"
    ).length;

    const resolvedCount=alerts.filter(
        alert=>alert.status==="RESOLVED"
    ).length;

    const formatTime=(timestamp)=>{
        if(!timestamp){
            return "Unknown time";
        }

        return new Date(timestamp).toLocaleString();
    };

    const formatRuleName=(ruleType)=>{
        if(!ruleType){
            return "";
        }

        return ruleType
            .replaceAll("_"," ")
            .toLowerCase()
            .replace(/\b\w/g,letter=>letter.toUpperCase());
    };

    return(
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        <FiAlertTriangle/>
                        ALERT MANAGEMENT
                    </div>

                    <h1>Alerts</h1>

                    <p>
                        Monitor important application errors and resolve
                        incidents detected by LogPulse.
                    </p>
                </div>

                <button
                    className="primary-button refresh-button"
                    onClick={loadAlerts}
                    disabled={loading}
                >
                    <FiRefreshCw className={loading?"spin":""}/>
                    {loading?"Refreshing...":"Refresh"}
                </button>
            </div>

            {error&&(
                <div className="error-message">
                    <FiAlertCircle/>

                    <div>
                        <strong>Alert service unavailable</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="alert-metrics-grid">
                <div className="alert-metric-card">
                    <div className="alert-metric-icon active">
                        <FiAlertTriangle/>
                    </div>

                    <div>
                        <span>Active Alerts</span>
                        <strong>{activeCount}</strong>
                    </div>
                </div>

                <div className="alert-metric-card">
                    <div className="alert-metric-icon critical">
                        <FiAlertCircle/>
                    </div>

                    <div>
                        <span>Critical</span>
                        <strong>{criticalCount}</strong>
                    </div>
                </div>

                <div className="alert-metric-card">
                    <div className="alert-metric-icon high">
                        <FiAlertTriangle/>
                    </div>

                    <div>
                        <span>High</span>
                        <strong>{highCount}</strong>
                    </div>
                </div>

                <div className="alert-metric-card">
                    <div className="alert-metric-icon resolved">
                        <FiCheckCircle/>
                    </div>

                    <div>
                        <span>Resolved</span>
                        <strong>{resolvedCount}</strong>
                    </div>
                </div>
            </div>

            <div className="alerts-toolbar">
                <div>
                    <h2>Detected Incidents</h2>

                    <p>
                        Alerts generated from application log patterns
                        and monitoring rules.
                    </p>
                </div>

                <div className="alert-filter-group">
                    <button
                        className={filter==="ALL"?"active":""}
                        onClick={()=>setFilter("ALL")}
                    >
                        All
                    </button>

                    <button
                        className={filter==="ACTIVE"?"active":""}
                        onClick={()=>setFilter("ACTIVE")}
                    >
                        Active
                    </button>

                    <button
                        className={filter==="RESOLVED"?"active":""}
                        onClick={()=>setFilter("RESOLVED")}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            {loading?(
                <div className="loading-state alerts-loading">
                    <div className="loader"></div>
                    <p>Loading alerts...</p>
                </div>
            ):filteredAlerts.length===0?(
                <div className="alerts-empty-state">
                    <div className="alerts-empty-icon">
                        <FiCheckCircle/>
                    </div>

                    <h3>No alerts found</h3>

                    <p>
                        There are currently no alerts matching this filter.
                    </p>
                </div>
            ):(
                <div className="alerts-list">
                    {filteredAlerts.map(alert=>(
                        <div
                            className={`alert-card ${
                                alert.status==="RESOLVED"
                                    ?"resolved"
                                    :""
                            }`}
                            key={alert.id}
                        >
                            <div
                                className={`alert-severity-icon ${
                                    alert.severity==="CRITICAL"
                                        ?"critical"
                                        :"high"
                                }`}
                            >
                                {alert.severity==="CRITICAL"
                                    ?<FiAlertCircle/>
                                    :<FiAlertTriangle/>
                                }
                            </div>

                            <div className="alert-card-content">
                                <div className="alert-card-top">
                                    <div className="alert-tags">
                                        <span
                                            className={`severity-badge ${
                                                alert.severity
                                                    ?.toLowerCase()
                                            }`}
                                        >
                                            {alert.severity}
                                        </span>

                                        <span
                                            className={`alert-status-badge ${
                                                alert.status
                                                    ?.toLowerCase()
                                            }`}
                                        >
                                            {alert.status}
                                        </span>
                                    </div>

                                    <div className="alert-time">
                                        <FiClock/>
                                        {formatTime(alert.timestamp)}
                                    </div>
                                </div>

                                <h3>{alert.message}</h3>

                                <div className="alert-details">
                                    <div>
                                        <FiServer/>
                                        <span>
                                            {alert.service||"Unknown service"}
                                        </span>
                                    </div>

                                    {alert.traceId&&(
                                        <div>
                                            <span className="trace-label">
                                                Trace
                                            </span>

                                            <code>{alert.traceId}</code>
                                        </div>
                                    )}
                                </div>

                                {alert.ruleType&&(
                                    <div className="alert-rule-info">
                                        <div className="alert-rule-title">
                                            <div className="alert-rule-heading">
                                                <FiActivity/>
                                                <span>Triggered Rule</span>
                                            </div>

                                            <strong>
                                                {formatRuleName(
                                                    alert.ruleType
                                                )}
                                            </strong>
                                        </div>

                                        <div className="alert-rule-stats">
                                            <div>
                                                <span>Observed</span>
                                                <strong>
                                                    {
                                                        alert.observedCount
                                                        ??"-"
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Threshold</span>
                                                <strong>
                                                    {
                                                        alert.threshold
                                                        ??"-"
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Window</span>
                                                <strong>
                                                    {
                                                        alert.windowSeconds
                                                            ?`${alert.windowSeconds}s`
                                                            :"-"
                                                    }
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {alert.status==="ACTIVE"&&(
                                <button
                                    className="resolve-alert-button"
                                    onClick={()=>
                                        handleResolve(alert.id)
                                    }
                                    disabled={
                                        resolvingId===alert.id
                                    }
                                >
                                    <FiCheckCircle/>

                                    {resolvingId===alert.id
                                        ?"Resolving..."
                                        :"Resolve"
                                    }
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Alerts;