import {useCallback,useEffect,useMemo,useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    FiAlertCircle,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiDatabase,
    FiFilter,
    FiGitBranch,
    FiRefreshCw,
    FiSearch,
    FiServer,
    FiX
} from "react-icons/fi";

import {searchLogs} from "../api/logApi";
import SeverityBadge from "../components/SeverityBadge";

const PAGE_SIZE=25;

const EMPTY_FILTERS={
    keyword:"",
    service:"",
    level:"",
    environment:"",
    timeRange:"ALL"
};

const Logs=()=>{
    const navigate=useNavigate();

    const [logs,setLogs]=useState([]);
    const [filters,setFilters]=useState(EMPTY_FILTERS);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");
    const [page,setPage]=useState(0);
    const [totalPages,setTotalPages]=useState(0);
    const [totalElements,setTotalElements]=useState(0);

    const loadLogs=useCallback(async(searchFilters=EMPTY_FILTERS)=>{
        try{
            setLoading(true);

            const requestFilters={
                keyword:searchFilters.keyword,
                service:searchFilters.service,
                level:searchFilters.level,
                environment:searchFilters.environment,
                page:searchFilters.page??0,
                size:PAGE_SIZE
            };

            if(searchFilters.timeRange!=="ALL"){
                const now=new Date();
                const start=new Date(now);

                if(searchFilters.timeRange==="15_MIN"){
                    start.setMinutes(start.getMinutes()-15);
                }

                if(searchFilters.timeRange==="1_HOUR"){
                    start.setHours(start.getHours()-1);
                }

                if(searchFilters.timeRange==="6_HOURS"){
                    start.setHours(start.getHours()-6);
                }

                if(searchFilters.timeRange==="24_HOURS"){
                    start.setHours(start.getHours()-24);
                }

                requestFilters.startTime=start.toISOString();
                requestFilters.endTime=now.toISOString();
            }

            const data=await searchLogs(requestFilters);

            setLogs(data.logs||[]);
            setPage(data.page??0);
            setTotalPages(data.totalPages??0);
            setTotalElements(data.totalElements??0);
            setError("");
        }catch(err){
            console.error(err);
            setLogs([]);
            setTotalPages(0);
            setTotalElements(0);
            setError("Unable to search logs.");
        }finally{
            setLoading(false);
        }
    },[]);

    useEffect(()=>{
        loadLogs({
            ...EMPTY_FILTERS,
            page:0
        });
    },[loadLogs]);

    const handleChange=(event)=>{
        const {name,value}=event.target;

        setFilters(current=>({
            ...current,
            [name]:value
        }));
    };

    const handleSearch=(event)=>{
        event.preventDefault();
        setPage(0);

        loadLogs({
            ...filters,
            page:0
        });
    };

    const handleReset=()=>{
        setFilters(EMPTY_FILTERS);
        setPage(0);

        loadLogs({
            ...EMPTY_FILTERS,
            page:0
        });
    };

    const handleRefresh=()=>{
        loadLogs({
            ...filters,
            page
        });
    };

    const changePage=(newPage)=>{
        if(newPage<0||newPage>=totalPages||newPage===page){
            return;
        }

        setPage(newPage);

        loadLogs({
            ...filters,
            page:newPage
        });

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    };

    const openTrace=(traceId)=>{
        if(!traceId){
            return;
        }

        navigate(
            `/traces/${encodeURIComponent(traceId)}`
        );
    };

    const services=useMemo(()=>{
        return [...new Set(
            logs
                .map(log=>log.service)
                .filter(Boolean)
        )].sort();
    },[logs]);

    const environments=useMemo(()=>{
        return [...new Set(
            logs
                .map(log=>log.environment)
                .filter(Boolean)
        )].sort();
    },[logs]);

    const activeFilterCount=[
        filters.keyword,
        filters.service,
        filters.level,
        filters.environment,
        filters.timeRange!=="ALL"
            ?filters.timeRange
            :""
    ].filter(Boolean).length;

    const formatTimestamp=(timestamp)=>{
        if(!timestamp){
            return {
                date:"Unknown",
                time:"-"
            };
        }

        const date=new Date(timestamp);

        return {
            date:date.toLocaleDateString([],{
                month:"short",
                day:"numeric"
            }),
            time:date.toLocaleTimeString([],{
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit"
            })
        };
    };

    const firstResult=
        totalElements===0
            ?0
            :page*PAGE_SIZE+1;

    const lastResult=Math.min(
        (page+1)*PAGE_SIZE,
        totalElements
    );

    return(
        <div className="page log-explorer-page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        <FiSearch/>
                        LOG EXPLORER
                    </div>

                    <h1>Search Logs</h1>

                    <p>
                        Search and filter application logs indexed
                        in Elasticsearch.
                    </p>
                </div>

                <button
                    className="primary-button refresh-button"
                    onClick={handleRefresh}
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
                        <strong>Search unavailable</strong>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="log-search-panel">
                <div className="log-search-panel-header">
                    <div>
                        <div className="log-search-icon">
                            <FiFilter/>
                        </div>

                        <div>
                            <h2>Filter Logs</h2>

                            <p>
                                Narrow results by message, service,
                                severity and time.
                            </p>
                        </div>
                    </div>

                    {activeFilterCount>0&&(
                        <span className="active-filter-count">
                            {activeFilterCount} active
                        </span>
                    )}
                </div>

                <form onSubmit={handleSearch}>
                    <div className="log-keyword-search">
                        <FiSearch/>

                        <input
                            type="text"
                            name="keyword"
                            value={filters.keyword}
                            onChange={handleChange}
                            placeholder="Search messages, errors, timeouts..."
                        />

                        {filters.keyword&&(
                            <button
                                type="button"
                                aria-label="Clear search"
                                onClick={()=>
                                    setFilters(current=>({
                                        ...current,
                                        keyword:""
                                    }))
                                }
                            >
                                <FiX/>
                            </button>
                        )}
                    </div>

                    <div className="log-filter-grid">
                        <div className="log-filter-field">
                            <label>Service</label>

                            <select
                                name="service"
                                value={filters.service}
                                onChange={handleChange}
                            >
                                <option value="">
                                    All Services
                                </option>

                                {services.map(service=>(
                                    <option
                                        value={service}
                                        key={service}
                                    >
                                        {service}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="log-filter-field">
                            <label>Severity</label>

                            <select
                                name="level"
                                value={filters.level}
                                onChange={handleChange}
                            >
                                <option value="">
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
                        </div>

                        <div className="log-filter-field">
                            <label>Environment</label>

                            <select
                                name="environment"
                                value={filters.environment}
                                onChange={handleChange}
                            >
                                <option value="">
                                    All Environments
                                </option>

                                {environments.map(environment=>(
                                    <option
                                        value={environment}
                                        key={environment}
                                    >
                                        {environment}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="log-filter-field">
                            <label>Time Range</label>

                            <select
                                name="timeRange"
                                value={filters.timeRange}
                                onChange={handleChange}
                            >
                                <option value="ALL">
                                    All Time
                                </option>

                                <option value="15_MIN">
                                    Last 15 minutes
                                </option>

                                <option value="1_HOUR">
                                    Last 1 hour
                                </option>

                                <option value="6_HOURS">
                                    Last 6 hours
                                </option>

                                <option value="24_HOURS">
                                    Last 24 hours
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="log-filter-actions">
                        <button
                            type="button"
                            className="log-reset-button"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            <FiX/>
                            Reset
                        </button>

                        <button
                            type="submit"
                            className="log-search-button"
                            disabled={loading}
                        >
                            <FiSearch/>
                            {loading?"Searching...":"Search Logs"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="log-results-section">
                <div className="log-results-header">
                    <div>
                        <h2>Search Results</h2>

                        <p>
                            Logs matching the current search criteria.
                        </p>
                    </div>

                    <div className="log-result-count">
                        <FiDatabase/>
                        <strong>{totalElements}</strong>

                        <span>
                            {totalElements===1?"log":"logs"} found
                        </span>
                    </div>
                </div>

                {loading?(
                    <div className="loading-state log-search-loading">
                        <div className="loader"></div>
                        <p>Searching Elasticsearch...</p>
                    </div>
                ):logs.length===0?(
                    <div className="log-search-empty">
                        <div>
                            <FiSearch/>
                        </div>

                        <h3>No matching logs</h3>

                        <p>
                            Try changing your search term, severity,
                            service or time range.
                        </p>
                    </div>
                ):(
                    <>
                        <div className="log-search-results">
                            {logs.map((log,index)=>{
                                const timestamp=formatTimestamp(
                                    log.timestamp
                                );

                                return(
                                    <div
                                        className={`log-result-card log-result-${
                                            (log.level||"info").toLowerCase()
                                        }`}
                                        key={log.id||index}
                                    >
                                        <div className="log-result-time">
                                            <FiClock/>

                                            <div>
                                                <strong>
                                                    {timestamp.time}
                                                </strong>

                                                <span>
                                                    {timestamp.date}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="log-result-content">
                                            <div className="log-result-top">
                                                <SeverityBadge
                                                    level={log.level}
                                                />

                                                <div className="log-result-service">
                                                    <FiServer/>
                                                    {log.service||
                                                        "unknown-service"}
                                                </div>
                                            </div>

                                            <p className="log-result-message">
                                                {log.message||"-"}
                                            </p>

                                            <div className="log-result-meta">
                                                {log.environment&&(
                                                    <span className="environment-tag">
                                                        {log.environment}
                                                    </span>
                                                )}

                                                {log.host&&(
                                                    <span>
                                                        <FiServer/>
                                                        {log.host}
                                                    </span>
                                                )}

                                                {log.traceId&&(
                                                    <button
                                                        type="button"
                                                        className="trace-link"
                                                        title="Open distributed trace"
                                                        onClick={()=>
                                                            openTrace(
                                                                log.traceId
                                                            )
                                                        }
                                                    >
                                                        <FiGitBranch/>
                                                        {log.traceId}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="log-pagination">
                            <div className="pagination-summary">
                                Showing{" "}
                                <strong>{firstResult}</strong>
                                {" - "}
                                <strong>{lastResult}</strong>
                                {" of "}
                                <strong>{totalElements}</strong>
                                {" logs"}
                            </div>

                            <div className="pagination-controls">
                                <button
                                    type="button"
                                    onClick={()=>changePage(page-1)}
                                    disabled={page===0||loading}
                                >
                                    <FiChevronLeft/>
                                    Previous
                                </button>

                                <span>
                                    Page{" "}
                                    <strong>{page+1}</strong>
                                    {" of "}
                                    <strong>
                                        {Math.max(totalPages,1)}
                                    </strong>
                                </span>

                                <button
                                    type="button"
                                    onClick={()=>changePage(page+1)}
                                    disabled={
                                        page>=totalPages-1||
                                        loading
                                    }
                                >
                                    Next
                                    <FiChevronRight/>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Logs;