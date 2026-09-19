const MetricCard = ({ title, value, icon }) => {
    return (
        <div className="metric-card">
            <div className="metric-icon">
                {icon}
            </div>

            <div>
                <p className="metric-title">{title}</p>
                <h2 className="metric-value">{value}</h2>
            </div>
        </div>
    );
};

export default MetricCard;