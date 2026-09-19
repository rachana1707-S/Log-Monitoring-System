import SeverityBadge from "./SeverityBadge";

const LogTable = ({ logs }) => {
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
                            <td colSpan="5" className="no-logs">
                                No logs found
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id}>
                                <td>
                                    {log.timestamp
                                        ? new Date(log.timestamp).toLocaleTimeString()
                                        : "-"}
                                </td>

                                <td>
                                    <SeverityBadge level={log.level} />
                                </td>

                                <td>{log.service}</td>

                                <td className="log-message">
                                    {log.message}
                                </td>

                                <td>{log.environment}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogTable;