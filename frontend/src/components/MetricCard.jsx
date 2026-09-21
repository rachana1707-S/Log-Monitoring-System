import { FiArrowUpRight } from "react-icons/fi";

const MetricCard = ({
    title,
    value,
    icon,
    type = "primary",
    subtitle
}) => {

    return (
        <div className={`metric-card ${type}`}>

            <div className="metric-card-top">

                <div
                    className={`metric-icon ${type}`}
                >
                    {icon}
                </div>

                <div className="metric-trend">
                    <FiArrowUpRight />
                </div>

            </div>

            <div className="metric-content">

                <span className="metric-title">
                    {title}
                </span>

                <h2>
                    {value}
                </h2>

                {subtitle && (
                    <p>
                        {subtitle}
                    </p>
                )}

            </div>

        </div>
    );
};

export default MetricCard;