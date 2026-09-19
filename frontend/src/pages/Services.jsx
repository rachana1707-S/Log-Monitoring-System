import { useEffect, useState } from "react";

import {
    FiActivity,
    FiServer
} from "react-icons/fi";

import { getLogs } from "../api/logApi";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);

            const logs = await getLogs();

            const serviceMap = {};

            logs.forEach((log) => {
                if (!log.service) {
                    return;
                }

                if (!serviceMap[log.service]) {
                    serviceMap[log.service] = {
                        name: log.service,
                        total: 0,
                        errors: 0,
                        warnings: 0
                    };
                }

                serviceMap[log.service].total++;

                if (log.level === "ERROR") {
                    serviceMap[log.service].errors++;
                }

                if (log.level === "WARN") {
                    serviceMap[log.service].warnings++;
                }
            });

            setServices(
                Object.values(serviceMap)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-label">
                        INFRASTRUCTURE
                    </div>

                    <h1>Services</h1>

                    <p>
                        Applications currently sending logs
                        to LogPulse.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading services...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="empty-state large">
                    <FiServer />

                    <h2>No services found</h2>

                    <p>
                        Services will appear here after
                        LogPulse receives their logs.
                    </p>
                </div>
            ) : (
                <div className="services-grid">
                    {services.map((service) => (
                        <div
                            className="service-card"
                            key={service.name}
                        >
                            <div className="service-card-header">
                                <div className="service-icon">
                                    <FiServer />
                                </div>

                                <div className="service-online">
                                    <span></span>
                                    Active
                                </div>
                            </div>

                            <h3>{service.name}</h3>

                            <div className="service-activity">
                                <FiActivity />
                                Sending log events
                            </div>

                            <div className="service-stats">
                                <div>
                                    <span>Total Logs</span>
                                    <strong>
                                        {service.total}
                                    </strong>
                                </div>

                                <div>
                                    <span>Errors</span>
                                    <strong className="error-number">
                                        {service.errors}
                                    </strong>
                                </div>

                                <div>
                                    <span>Warnings</span>
                                    <strong className="warning-number">
                                        {service.warnings}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Services;