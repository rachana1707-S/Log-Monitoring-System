import {useEffect,useRef,useState} from "react";
import {
    FiActivity,
    FiAlertCircle,
    FiClock,
    FiHash,
    FiPause,
    FiPlay,
    FiServer,
    FiTrash2,
    FiWifi,
    FiWifiOff
} from "react-icons/fi";

import {
    connectToLogs,
    disconnectFromLogs
} from "../services/websocketService";

import SeverityBadge from "../components/SeverityBadge";

const MAX_LOGS=200;

const LiveLogs=()=>{
    const [logs,setLogs]=useState([]);
    const [connected,setConnected]=useState(false);
    const [paused,setPaused]=useState(false);
    const [level,setLevel]=useState("ALL");

    const pausedRef=useRef(false);

    useEffect(()=>{
        connectToLogs(
            (newLog)=>{
                if(pausedRef.current){
                    return;
                }

                setLogs((currentLogs)=>{
                    const updatedLogs=[
                        newLog,
                        ...currentLogs
                    ];

                    return updatedLogs.slice(0,MAX_LOGS);
                });
            },
            ()=>{
                setConnected(true);
            },
            ()=>{
                setConnected(false);
            }
        );

        return ()=>{
            disconnectFromLogs();
        };
    },[]);

    const togglePause=()=>{
        const nextValue=!paused;

        setPaused(nextValue);
        pausedRef.current=nextValue;
    };

    const clearLogs=()=>{
        setLogs([]);
    };

    const filteredLogs=
        level==="ALL"
            ?logs
            :logs.filter((log)=>log.level===level);

    const formatTime=(timestamp)=>{
        if(!timestamp){
            return "-";
        }

        return new Date(timestamp).toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        });
    };

    return(
        <div className="page live-logs-page">
            <div className="page-header">
                <div>
                    <div className="page-label live-page-label">
                        <FiActivity/>
                        REAL-TIME MONITORING
                    </div>

                    <h1>Live Logs</h1>

                    <p>
                        Watch application events arrive in LogPulse in real time.
                    </p>
                </div>

                <div
                    className={
                        connected
                            ?"ws-status connected"
                            :"ws-status disconnected"
                    }
                >
                    {connected?<FiWifi/>:<FiWifiOff/>}

                    <span className="ws-status-dot"></span>

                    {connected?"Connected":"Disconnected"}
                </div>
            </div>

            <div className="live-summary-grid">
                <div className="live-summary-card">
                    <div className="live-summary-icon">
                        <FiActivity/>
                    </div>

                    <div>
                        <span>Session Events</span>
                        <strong>{logs.length}</strong>
                    </div>
                </div>

                <div className="live-summary-card">
                    <div className="live-summary-icon error">
                        <FiAlertCircle/>
                    </div>

                    <div>
                        <span>Errors</span>
                        <strong>
                            {logs.filter(
                                (log)=>
                                    log.level==="ERROR"||
                                    log.level==="FATAL"
                            ).length}
                        </strong>
                    </div>
                </div>

                <div className="live-summary-card">
                    <div className="live-summary-icon">
                        <FiServer/>
                    </div>

                    <div>
                        <span>Services</span>
                        <strong>
                            {
                                new Set(
                                    logs
                                        .map((log)=>log.service)
                                        .filter(Boolean)
                                ).size
                            }
                        </strong>
                    </div>
                </div>

                <div className="live-summary-card">
                    <div
                        className={
                            connected
                                ?"live-summary-icon online"
                                :"live-summary-icon offline"
                        }
                    >
                        {connected?<FiWifi/>:<FiWifiOff/>}
                    </div>

                    <div>
                        <span>Stream</span>
                        <strong className="stream-text">
                            {paused
                                ?"Paused"
                                :connected
                                ?"Live"
                                :"Offline"}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="live-console">
                <div className="live-console-top">
                    <div className="live-console-title">
                        <div className="live-console-icon">
                            <FiActivity/>
                        </div>

                        <div>
                            <h2>Live Event Stream</h2>

                            <p>
                                Events received from connected applications
                            </p>
                        </div>
                    </div>

                    <div className="live-stream-state">
                        <span
                            className={
                                connected&&!paused
                                    ?"stream-pulse active"
                                    :"stream-pulse"
                            }
                        ></span>

                        {paused
                            ?"Stream paused"
                            :connected
                            ?"Listening for events"
                            :"Waiting for connection"}
                    </div>
                </div>

                <div className="live-toolbar">
                    <div className="live-toolbar-left">
                        <div className="live-filter-wrapper">
                            <span>Severity</span>

                            <select
                                value={level}
                                onChange={(event)=>
                                    setLevel(event.target.value)
                                }
                                className="live-select"
                            >
                                <option value="ALL">All Levels</option>
                                <option value="TRACE">TRACE</option>
                                <option value="DEBUG">DEBUG</option>
                                <option value="INFO">INFO</option>
                                <option value="WARN">WARN</option>
                                <option value="ERROR">ERROR</option>
                                <option value="FATAL">FATAL</option>
                            </select>
                        </div>

                        <span className="live-count">
                            {filteredLogs.length} events
                        </span>
                    </div>

                    <div className="live-toolbar-actions">
                        <button
                            className={
                                paused
                                    ?"resume-button"
                                    :"pause-button"
                            }
                            onClick={togglePause}
                        >
                            {paused?<FiPlay/>:<FiPause/>}
                            {paused?"Resume Stream":"Pause Stream"}
                        </button>

                        <button
                            className="clear-button"
                            onClick={clearLogs}
                            disabled={logs.length===0}
                        >
                            <FiTrash2/>
                            Clear
                        </button>
                    </div>
                </div>

                <div className="live-terminal">
                    <div className="terminal-columns">
                        <span>Time</span>
                        <span>Level</span>
                        <span>Service / Event</span>
                        <span>Source</span>
                    </div>

                    <div className="terminal-body">
                        {filteredLogs.length===0?(
                            <div className="terminal-empty">
                                <div className="terminal-empty-icon">
                                    <FiActivity/>
                                </div>

                                <h3>
                                    {paused
                                        ?"Log stream is paused"
                                        :"Waiting for logs"}
                                </h3>

                                <p>
                                    {paused
                                        ?"Resume the stream to receive new application events."
                                        :"Send a log to POST /api/logs and new events will appear here automatically."}
                                </p>

                                {!paused&&connected&&(
                                    <div className="waiting-indicator">
                                        <span></span>
                                        Listening
                                    </div>
                                )}
                            </div>
                        ):(
                            filteredLogs.map((log,index)=>(
                                <div
                                    className={`live-log-row live-log-${(
                                        log.level||"info"
                                    ).toLowerCase()}`}
                                    key={log.id||index}
                                >
                                    <div className="live-time">
                                        <FiClock/>
                                        {formatTime(log.timestamp)}
                                    </div>

                                    <div className="live-level">
                                        <SeverityBadge level={log.level}/>
                                    </div>

                                    <div className="live-event-content">
                                        <div className="live-event-service">
                                            <FiServer/>
                                            {log.service||"unknown-service"}
                                        </div>

                                        <div className="live-message">
                                            {log.message||"-"}
                                        </div>

                                        <div className="live-event-meta">
                                            {log.environment&&(
                                                <span className="live-environment">
                                                    {log.environment}
                                                </span>
                                            )}

                                            {log.traceId&&(
                                                <span>
                                                    <FiHash/>
                                                    {log.traceId}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="live-source">
                                        <FiServer/>

                                        <div>
                                            <span>{log.host||"Unknown host"}</span>
                                            <small>
                                                {log.environment||"environment unavailable"}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="live-console-footer">
                    <div>
                        <span
                            className={
                                connected
                                    ?"footer-status-dot connected"
                                    :"footer-status-dot"
                            }
                        ></span>

                        WebSocket {connected?"connected":"disconnected"}
                    </div>

                    <span>
                        Showing {filteredLogs.length} of {logs.length} session events
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LiveLogs;