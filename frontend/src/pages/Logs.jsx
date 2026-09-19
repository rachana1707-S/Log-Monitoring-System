import { useEffect, useState } from "react";

import {
    FiRefreshCw,
    FiSearch,
    FiX
} from "react-icons/fi";

import {
    getLogs,
    getLogsByLevel,
    getLogsByService,
    searchLogs
} from "../api/logApi";

import LogTable from "../components/LogTable";

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [service, setService] = useState("");
    const [level, setLevel] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAllLogs();
    }, []);

    const loadAllLogs = async () => {
        try {
            setLoading(true);

            const data = await getLogs();

            setLogs(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load logs.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);

            let data;

            if (search.trim()) {
                data = await searchLogs(search.trim());
            } else if (service.trim()) {
                data = await getLogsByService(
                    service.trim()
                );
            } else if (level) {
                data = await getLogsByLevel(level);
            } else {
                data = await getLogs();
            }

            setLogs(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to search logs.");
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setService("");
        setLevel("");
        loadAllLogs();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        MONITORING
                    </div>

                    <h1>Log Explorer</h1>

                    <p>
                        Search and investigate application
                        events.
                    </p>
                </div>

                <button
                    className="icon-action-button"
                    onClick={loadAllLogs}
                    title="Refresh logs"
                >
                    <FiRefreshCw />
                </button>
            </div>

            <div className="filter-panel">
                <div className="search-input-wrapper">
                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <input
                    className="filter-input"
                    type="text"
                    placeholder="Service name"
                    value={service}
                    onChange={(event) =>
                        setService(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                />

                <select
                    className="filter-select"
                    value={level}
                    onChange={(event) =>
                        setLevel(event.target.value)
                    }
                >
                    <option value="">
                        All levels
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

                <button
                    className="primary-button"
                    onClick={handleSearch}
                >
                    <FiSearch />
                    Search
                </button>

                <button
                    className="secondary-button"
                    onClick={clearFilters}
                >
                    <FiX />
                    Clear
                </button>
            </div>

            <div className="results-header">
                <div>
                    <strong>{logs.length}</strong>
                    <span>
                        {logs.length === 1
                            ? " log found"
                            : " logs found"}
                    </span>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading logs...</p>
                </div>
            ) : (
                <LogTable logs={logs} />
            )}
        </div>
    );
};

export default Logs;