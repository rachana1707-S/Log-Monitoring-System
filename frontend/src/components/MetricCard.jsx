const MetricCard = ({ title, value, icon, type = "default" }) => {
    return (
        <div className={`metric-card metric-${type}`}>
            <div className="metric-card-top">
                <div className="metric-icon">
                    {icon}
                </div>

                <span className="metric-indicator"></span>
            </div>

            <div className="metric-content">
                <p className="metric-title">
                    {title}
                </p>

                <h2 className="metric-value">
                    {value}
                </h2>
            </div>
        </div>
    );
};

export default MetricCard;