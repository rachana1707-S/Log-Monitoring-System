import {useCallback,useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import {
    FiActivity,
    FiAlertCircle,
    FiArrowLeft,
    FiCheckCircle,
    FiClock,
    FiDatabase,
    FiGitBranch,
    FiHash,
    FiRefreshCw,
    FiServer
} from "react-icons/fi";

import {getTrace} from "../api/traceApi";
import SeverityBadge from "../components/SeverityBadge";

const TraceDetails=()=>{
    const {traceId}=useParams();
    const navigate=useNavigate();

    const [trace,setTrace]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const loadTrace=useCallback(async()=>{
        try{
            setLoading(true);

            const data=await getTrace(traceId);

            setTrace(data);
            setError("");
        }catch(err){
            console.error(err);
            setTrace(null);
            setError(
                err.message==="Trace not found"
                    ?"This trace could not be found."
                    :"Unable to load trace data."
            );
        }finally{
            setLoading(false);
        }
    },[traceId]);

    useEffect(()=>{
        loadTrace();
    },[loadTrace]);

    const formatTimestamp=(timestamp)=>{
        if(!timestamp){
            return {
                time:"-",
                milliseconds:"",
                date:""
            };
        }

        const date=new Date(timestamp);

        const time=date.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit",
            hour12:false
        });

        const milliseconds=String(
            date.getMilliseconds()
        ).padStart(3,"0");

        const formattedDate=date.toLocaleDateString([],{
            month:"short",
            day:"numeric",
            year:"numeric"
        });

        return {
            time,
            milliseconds,
            date:formattedDate
        };
    };

    const formatDuration=(milliseconds)=>{
        if(milliseconds===null||milliseconds===undefined){
            return "-";
        }

        if(milliseconds<1000){
            return `${milliseconds} ms`;
        }

        if(milliseconds<60000){
            return `${(milliseconds/1000).toFixed(2)} s`;
        }

        const minutes=Math.floor(milliseconds/60000);
        const seconds=Math.floor(
            (milliseconds%60000)/1000
        );

        return `${minutes}m ${seconds}s`;
    };

    const getServiceNumber=(service)=>{
        if(!trace?.services){
            return 1;
        }

        const index=trace.services.indexOf(service);

        return index===-1?1:index+1;
    };

    return(
        <div className="page trace-page">
            <div className="trace-back-row">
                <button
                    className="trace-back-button"
                    onClick={()=>navigate(-1)}
                >
                    <FiArrowLeft/>
                    Back to logs
                </button>
            </div>

            <div className="page-header">
                <div>
                    <div className="page-label">
                        <FiGitBranch/>
                        DISTRIBUTED TRACE
                    </div>

                    <h1>Trace Explorer</h1>

                    <p>
                        Follow a request across application services
                        and inspect every correlated log event.
                    </p>
                </div>

                <button
                    className="primary-button refresh-button"
                    onClick={loadTrace}
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
                        <strong>Trace unavailable</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {loading?(
                <div className="trace-loading">
                    <div className="loader"></div>
                    <p>Loading distributed trace...</p>
                </div>
            ):trace?(
                <>
                    <div className="trace-hero">
                        <div className="trace-hero-main">
                            <div className="trace-hero-icon">
                                <FiGitBranch/>
                            </div>

                            <div className="trace-hero-content">
                                <span className="trace-hero-label">
                                    TRACE ID
                                </span>

                                <h2>{trace.traceId}</h2>

                                <div className="trace-service-list">
                                    {trace.services?.map(service=>(
                                        <span key={service}>
                                            <FiServer/>
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                trace.hasErrors
                                    ?"trace-health error"
                                    :"trace-health success"
                            }
                        >
                            {trace.hasErrors
                                ?<FiAlertCircle/>
                                :<FiCheckCircle/>
                            }

                            {trace.hasErrors
                                ?"Errors detected"
                                :"Completed"
                            }
                        </div>
                    </div>

                    <div className="trace-metrics-grid">
                        <div className="trace-metric-card">
                            <div className="trace-metric-icon">
                                <FiActivity/>
                            </div>

                            <div>
                                <span>Events</span>
                                <strong>{trace.eventCount}</strong>
                            </div>
                        </div>

                        <div className="trace-metric-card">
                            <div className="trace-metric-icon">
                                <FiServer/>
                            </div>

                            <div>
                                <span>Services</span>
                                <strong>{trace.serviceCount}</strong>
                            </div>
                        </div>

                        <div className="trace-metric-card">
                            <div className="trace-metric-icon">
                                <FiClock/>
                            </div>

                            <div>
                                <span>Duration</span>
                                <strong>
                                    {formatDuration(trace.durationMs)}
                                </strong>
                            </div>
                        </div>

                        <div className="trace-metric-card">
                            <div
                                className={`trace-metric-icon ${
                                    trace.hasErrors
                                        ?"error"
                                        :"success"
                                }`}
                            >
                                {trace.hasErrors
                                    ?<FiAlertCircle/>
                                    :<FiCheckCircle/>
                                }
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {trace.hasErrors
                                        ?"Error"
                                        :"Success"
                                    }
                                </strong>
                            </div>
                        </div>
                    </div>

                    <section className="trace-section">
                        <div className="trace-section-header">
                            <div>
                                <h2>Request Timeline</h2>

                                <p>
                                    Events are ordered from the beginning
                                    of the request to the latest activity.
                                </p>
                            </div>

                            <span className="trace-event-count">
                                {trace.eventCount} events
                            </span>
                        </div>

                        <div className="trace-timeline">
                            {trace.events?.map((event,index)=>{
                                const timestamp=formatTimestamp(
                                    event.timestamp
                                );

                                const isLast=
                                    index===trace.events.length-1;

                                return(
                                    <div
                                        className="trace-event"
                                        key={event.id||index}
                                    >
                                        <div className="trace-event-time">
                                            <strong>
                                                {timestamp.time}
                                                <span>
                                                    .{timestamp.milliseconds}
                                                </span>
                                            </strong>

                                            <small>
                                                {timestamp.date}
                                            </small>
                                        </div>

                                        <div className="trace-line-column">
                                            <div
                                                className={`trace-node ${
                                                    (
                                                        event.level||
                                                        "INFO"
                                                    ).toLowerCase()
                                                }`}
                                            >
                                                {event.level==="ERROR"||
                                                event.level==="FATAL"
                                                    ?<FiAlertCircle/>
                                                    :<FiActivity/>
                                                }
                                            </div>

                                            {!isLast&&(
                                                <div className="trace-line">
                                                </div>
                                            )}
                                        </div>

                                        <div className="trace-event-card">
                                            <div className="trace-event-header">
                                                <div className="trace-event-service">
                                                    <div className="trace-service-icon">
                                                        <FiServer/>
                                                    </div>

                                                    <div>
                                                        <h3>
                                                            {event.service||
                                                                "unknown-service"}
                                                        </h3>

                                                        <span>
                                                            Service{" "}
                                                            {getServiceNumber(
                                                                event.service
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <SeverityBadge
                                                    level={event.level}
                                                />
                                            </div>

                                            <p className="trace-event-message">
                                                {event.message||"-"}
                                            </p>

                                            <div className="trace-event-meta">
                                                {event.environment&&(
                                                    <span>
                                                        <FiActivity/>
                                                        {event.environment}
                                                    </span>
                                                )}

                                                {event.host&&(
                                                    <span>
                                                        <FiDatabase/>
                                                        {event.host}
                                                    </span>
                                                )}

                                                <span>
                                                    <FiHash/>
                                                    {event.id||
                                                        `event-${index+1}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </>
            ):null}
        </div>
    );
};

export default TraceDetails;