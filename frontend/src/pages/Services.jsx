import {useCallback,useEffect,useState} from "react";
import {
    FiActivity,
    FiAlertCircle,
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiDatabase,
    FiRefreshCw,
    FiServer,
    FiWifiOff
} from "react-icons/fi";

import {getServices} from "../api/serviceApi";

const Services=()=>{
    const [services,setServices]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const loadServices=useCallback(async()=>{
        try{
            setLoading(true);

            const data=await getServices();

            setServices(data);
            setError("");
        }catch(err){
            console.error(err);
            setError("Unable to load service health data.");
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        loadServices();
    },[loadServices]);

    const healthyCount=services.filter(
        service=>service.status==="HEALTHY"
    ).length;

    const degradedCount=services.filter(
        service=>service.status==="DEGRADED"
    ).length;

    const criticalCount=services.filter(
        service=>service.status==="CRITICAL"
    ).length;

    const inactiveCount=services.filter(
        service=>service.status==="INACTIVE"
    ).length;

    const getStatusIcon=(status)=>{
        if(status==="HEALTHY"){
            return <FiCheckCircle/>;
        }

        if(status==="DEGRADED"){
            return <FiAlertTriangle/>;
        }

        if(status==="CRITICAL"){
            return <FiAlertCircle/>;
        }

        return <FiWifiOff/>;
    };

    const formatLastActivity=(timestamp)=>{
        if(!timestamp){
            return "No activity";
        }

        const activityTime=new Date(timestamp);
        const now=new Date();

        const seconds=Math.max(
            0,
            Math.floor(
                (now.getTime()-activityTime.getTime())/1000
            )
        );

        if(seconds<60){
            return `${seconds}s ago`;
        }

        const minutes=Math.floor(seconds/60);

        if(minutes<60){
            return `${minutes}m ago`;
        }

        const hours=Math.floor(minutes/60);

        if(hours<24){
            return `${hours}h ago`;
        }

        const days=Math.floor(hours/24);

        return `${days}d ago`;
    };

    return(
        <div className="page services-page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        <FiActivity/>
                        SERVICE MONITORING
                    </div>

                    <h1>Services</h1>

                    <p>
                        Monitor application health, log activity
                        and error rates across connected services.
                    </p>
                </div>

                <button
                    className="primary-button refresh-button"
                    onClick={loadServices}
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
                        <strong>Service monitoring unavailable</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="service-summary-grid">
                <div className="service-summary-card">
                    <div className="service-summary-icon total">
                        <FiServer/>
                    </div>

                    <div>
                        <span>Total Services</span>
                        <strong>{services.length}</strong>
                    </div>
                </div>

                <div className="service-summary-card">
                    <div className="service-summary-icon healthy">
                        <FiCheckCircle/>
                    </div>

                    <div>
                        <span>Healthy</span>
                        <strong>{healthyCount}</strong>
                    </div>
                </div>

                <div className="service-summary-card">
                    <div className="service-summary-icon degraded">
                        <FiAlertTriangle/>
                    </div>

                    <div>
                        <span>Degraded</span>
                        <strong>{degradedCount}</strong>
                    </div>
                </div>

                <div className="service-summary-card">
                    <div className="service-summary-icon critical">
                        <FiAlertCircle/>
                    </div>

                    <div>
                        <span>Critical</span>
                        <strong>{criticalCount}</strong>
                    </div>
                </div>

                <div className="service-summary-card">
                    <div className="service-summary-icon inactive">
                        <FiWifiOff/>
                    </div>

                    <div>
                        <span>Inactive</span>
                        <strong>{inactiveCount}</strong>
                    </div>
                </div>
            </div>

            <div className="services-section">
                <div className="services-section-header">
                    <div>
                        <h2>Connected Services</h2>

                        <p>
                            Health calculated from indexed application logs.
                        </p>
                    </div>

                    <div className="services-live-status">
                        <span></span>
                        Monitoring
                    </div>
                </div>

                {loading?(
                    <div className="loading-state services-loading">
                        <div className="loader"></div>
                        <p>Loading services...</p>
                    </div>
                ):services.length===0?(
                    <div className="services-empty-state">
                        <div>
                            <FiServer/>
                        </div>

                        <h3>No services detected</h3>

                        <p>
                            Services will appear after applications
                            start sending logs to LogPulse.
                        </p>
                    </div>
                ):(
                    <div className="services-grid">
                        {services.map(service=>(
                            <div
                                className={`service-health-card ${
                                    service.status.toLowerCase()
                                }`}
                                key={service.service}
                            >
                                <div className="service-card-header">
                                    <div className="service-card-name">
                                        <div className="service-card-icon">
                                            <FiServer/>
                                        </div>

                                        <div>
                                            <h3>{service.service}</h3>

                                            <span>
                                                Application service
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`service-status-badge ${
                                            service.status.toLowerCase()
                                        }`}
                                    >
                                        {getStatusIcon(service.status)}
                                        {service.status}
                                    </div>
                                </div>

                                <div className="service-card-metrics">
                                    <div>
                                        <span>Total Logs</span>

                                        <strong>
                                            {service.totalLogs}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Errors</span>

                                        <strong className="service-error-value">
                                            {service.errorCount}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Warnings</span>

                                        <strong className="service-warning-value">
                                            {service.warningCount}
                                        </strong>
                                    </div>
                                </div>

                                <div className="service-error-rate">
                                    <div className="service-error-rate-header">
                                        <span>Error Rate</span>

                                        <strong>
                                            {service.errorRate.toFixed(1)}%
                                        </strong>
                                    </div>

                                    <div className="service-health-bar">
                                        <div
                                            className={
                                                service.status.toLowerCase()
                                            }
                                            style={{
                                                width:`${Math.min(
                                                    service.errorRate,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="service-card-footer">
                                    <div>
                                        <FiClock/>

                                        <span>
                                            Last activity
                                        </span>

                                        <strong>
                                            {formatLastActivity(
                                                service.lastActivity
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <FiDatabase/>

                                        <span>
                                            Elasticsearch
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;