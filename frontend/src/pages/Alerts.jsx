import { FiBell } from "react-icons/fi";

const Alerts = () => {
    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Alerts</h1>
                    <p>
                        Configure monitoring and error alerts.
                    </p>
                </div>
            </div>

            <div className="empty-state large">
                <FiBell />

                <h2>No alert rules yet</h2>

                <p>
                    Alert rules will be configured in the
                    next phase of LogPulse.
                </p>
            </div>
        </div>
    );
};

export default Alerts;