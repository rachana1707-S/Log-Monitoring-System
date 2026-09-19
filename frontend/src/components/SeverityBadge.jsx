const SeverityBadge = ({ level }) => {
    return (
        <span className={`severity-badge severity-${level?.toLowerCase()}`}>
            {level}
        </span>
    );
};

export default SeverityBadge;