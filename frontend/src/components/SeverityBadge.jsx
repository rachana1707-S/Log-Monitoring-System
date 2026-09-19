const SeverityBadge = ({ level }) => {
    if (!level) {
        return null;
    }

    return (
        <span
            className={`severity-badge severity-${level.toLowerCase()}`}
        >
            <span className="severity-dot"></span>
            {level}
        </span>
    );
};

export default SeverityBadge;