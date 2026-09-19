import { useEffect, useState } from "react";

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

    useEffect(() => {
        loadAllLogs();
    }, []);

    const loadAllLogs = async () => {
        try {
            setLoading(true);

            const data = await getLogs();

            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);

            let data;

            if (search.trim()) {
                data = await searchLogs(search);
            } else if (service.trim()) {
                data = await getLogsByService(service);
            } else if (level) {
                data = await getLogsByLevel(level);
            } else {
                data = await getLogs();
            }

            setLogs(data);
        } catch (error) {
            console.error(error);
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

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Log Explorer</h1>
                    <p>Search and filter application logs.</p>
                </div>
            </div>

            <div className="filter-panel">
                <input
                    type="text"
                    placeholder="Search log messages..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Service name"
                    value={service}
                    onChange={(event) =>
                        setService(event.target.value)
                    }
                />

                <select
                    value={level}
                    onChange={(event) =>
                        setLevel(event.target.value)
                    }
                >
                    <option value="">All levels</option>
                    <option value="TRACE">TRACE</option>
                    <option value="DEBUG">DEBUG</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                    <option value="FATAL">FATAL</option>
                </select>

                <button
                    className="primary-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

                <button
                    className="secondary-button"
                    onClick={clearFilters}
                >
                    Clear
                </button>
            </div>

            {loading ? (
                <div className="loading">
                    Loading logs...
                </div>
            ) : (
                <LogTable logs={logs} />
            )}
        </div>
    );
};

export default Logs;