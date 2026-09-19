import SeverityBadge from "./SeverityBadge";

const LogTable = ({ logs = [] }) => {
    const formatTime = (timestamp) => {
        if (!timestamp) {
            return "-";
        }

        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    return (
        <div className="log-table-container">
            <table className="log-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Level</th>
                        <th>Service</th>
                        <th>Message</th>
                        <th>Environment</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td
                                colSpan="5"
                                className="no-logs"
                            >
                                No logs found
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id}>
                                <td className="time-cell">
                                    {formatTime(log.timestamp)}
                                </td>

                                <td>
                                    <SeverityBadge
                                        level={log.level}
                                    />
                                </td>

                                <td>
                                    <span className="service-name">
                                        {log.service}
                                    </span>
                                </td>

                                <td className="log-message">
                                    {log.message}
                                </td>

                                <td>
                                    <span className="environment-badge">
                                        {log.environment || "-"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogTable;