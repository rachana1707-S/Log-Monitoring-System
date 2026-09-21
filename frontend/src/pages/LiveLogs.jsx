import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    FiActivity,
    FiPause,
    FiPlay,
    FiTrash2
} from "react-icons/fi";

import {
    connectToLogs,
    disconnectFromLogs
} from "../services/websocketService";

import SeverityBadge from "../components/SeverityBadge";

const MAX_LOGS = 200;

const LiveLogs = () => {

    const [logs, setLogs] = useState([]);

    const [connected, setConnected] =
        useState(false);

    const [paused, setPaused] =
        useState(false);

    const [level, setLevel] =
        useState("ALL");

    const pausedRef = useRef(false);

    const bottomRef = useRef(null);

    useEffect(() => {

        connectToLogs(
            (newLog) => {

                if (pausedRef.current) {
                    return;
                }

                setLogs((currentLogs) => {

                    const updatedLogs = [
                        newLog,
                        ...currentLogs
                    ];

                    return updatedLogs.slice(
                        0,
                        MAX_LOGS
                    );
                });
            },

            () => {
                setConnected(true);
            },

            () => {
                setConnected(false);
            }
        );

        return () => {
            disconnectFromLogs();
        };

    }, []);

    const togglePause = () => {

        const nextValue = !paused;

        setPaused(nextValue);

        pausedRef.current = nextValue;
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const filteredLogs =
        level === "ALL"
            ? logs
            : logs.filter(
                (log) =>
                    log.level === level
            );

    const formatTime = (timestamp) => {

        if (!timestamp) {
            return "-";
        }

        return new Date(
            timestamp
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    return (
        <div className="page">

            <div className="page-header">

                <div>

                    <div className="page-label">
                        REAL-TIME MONITORING
                    </div>

                    <h1>
                        Live Logs
                    </h1>

                    <p>
                        Watch application events
                        arrive in LogPulse in real time.
                    </p>

                </div>

                <div
                    className={
                        connected
                            ? "ws-status connected"
                            : "ws-status disconnected"
                    }
                >

                    <span></span>

                    {connected
                        ? "Live"
                        : "Disconnected"}

                </div>

            </div>

            <div className="live-toolbar">

                <div className="live-toolbar-left">

                    <select
                        value={level}
                        onChange={(event) =>
                            setLevel(
                                event.target.value
                            )
                        }
                        className="live-select"
                    >

                        <option value="ALL">
                            All Levels
                        </option>

                        <option value="TRACE">
                            TRACE
                        </option>

                        <option value="DEBUG">
                            DEBUG
                        </option>

                        <option value="INFO">
                            INFO
                        </option>

                        <option value="WARN">
                            WARN
                        </option>

                        <option value="ERROR">
                            ERROR
                        </option>

                        <option value="FATAL">
                            FATAL
                        </option>

                    </select>

                    <span className="live-count">
                        {filteredLogs.length}
                        {" "}
                        events
                    </span>

                </div>

                <div className="live-toolbar-actions">

                    <button
                        className={
                            paused
                                ? "resume-button"
                                : "pause-button"
                        }
                        onClick={togglePause}
                    >

                        {paused
                            ? <FiPlay />
                            : <FiPause />
                        }

                        {paused
                            ? "Resume"
                            : "Pause"
                        }

                    </button>

                    <button
                        className="clear-button"
                        onClick={clearLogs}
                    >

                        <FiTrash2 />

                        Clear

                    </button>

                </div>

            </div>

            <div className="live-terminal">

                <div className="terminal-header">

                    <div className="terminal-title">

                        <FiActivity />

                        Log Stream

                    </div>

                    <div className="terminal-status">

                        {paused
                            ? "Stream paused"
                            : "Listening for events"
                        }

                    </div>

                </div>

                <div className="terminal-body">

                    {filteredLogs.length === 0 ? (

                        <div className="terminal-empty">

                            <FiActivity />

                            <h3>
                                Waiting for logs
                            </h3>

                            <p>
                                Send a log to
                                POST /api/logs and it
                                will appear here.
                            </p>

                        </div>

                    ) : (

                        filteredLogs.map(
                            (log, index) => (

                                <div
                                    className=
                                        "live-log-row"
                                    key={
                                        log.id
                                        || index
                                    }
                                >

                                    <span
                                        className=
                                            "live-time"
                                    >
                                        {
                                            formatTime(
                                                log.timestamp
                                            )
                                        }
                                    </span>

                                    <SeverityBadge
                                        level={
                                            log.level
                                        }
                                    />

                                    <span
                                        className=
                                            "live-service"
                                    >
                                        {
                                            log.service
                                        }
                                    </span>

                                    <span
                                        className=
                                            "live-message"
                                    >
                                        {
                                            log.message
                                        }
                                    </span>

                                    <span
                                        className=
                                            "live-host"
                                    >
                                        {
                                            log.host
                                            || "-"
                                        }
                                    </span>

                                </div>

                            )
                        )

                    )}

                    <div ref={bottomRef}></div>

                </div>

            </div>

        </div>
    );
};

export default LiveLogs;