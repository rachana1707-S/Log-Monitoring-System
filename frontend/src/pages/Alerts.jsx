import {
    FiBell,
    FiPlus
} from "react-icons/fi";

const Alerts = () => {
    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        NOTIFICATIONS
                    </div>

                    <h1>Alerts</h1>

                    <p>
                        Create monitoring rules for important
                        application events.
                    </p>
                </div>
            </div>

            <div className="empty-state large alert-empty">
                <div className="empty-icon">
                    <FiBell />
                </div>

                <h2>No alert rules yet</h2>

                <p>
                    Alert rules will notify you when error
                    thresholds or service conditions are met.
                </p>

                <button
                    className="disabled-feature-button"
                    disabled
                >
                    <FiPlus />
                    Alert Engine Coming Next
                </button>
            </div>
        </div>
    );
};

export default Alerts;