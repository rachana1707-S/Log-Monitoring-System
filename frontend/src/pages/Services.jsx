import { useEffect, useState } from "react";

import { FiServer } from "react-icons/fi";

import { getLogs } from "../api/logApi";

const Services = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const logs = await getLogs();

            const serviceMap = {};

            logs.forEach((log) => {
                if (!serviceMap[log.service]) {
                    serviceMap[log.service] = {
                        name: log.service,
                        total: 0,
                        errors: 0
                    };
                }

                serviceMap[log.service].total++;

                if (log.level === "ERROR") {
                    serviceMap[log.service].errors++;
                }
            });

            setServices(Object.values(serviceMap));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Services</h1>
                    <p>
                        Monitor services sending logs to LogPulse.
                    </p>
                </div>
            </div>

            <div className="services-grid">
                {services.length === 0 ? (
                    <div className="empty-state">
                        No services found.
                    </div>
                ) : (
                    services.map((service) => (
                        <div
                            className="service-card"
                            key={service.name}
                        >
                            <div className="service-icon">
                                <FiServer />
                            </div>

                            <h3>{service.name}</h3>

                            <div className="service-status">
                                <span className="status-dot"></span>
                                Active
                            </div>

                            <div className="service-stats">
                                <div>
                                    <span>Total Logs</span>
                                    <strong>{service.total}</strong>
                                </div>

                                <div>
                                    <span>Errors</span>
                                    <strong>{service.errors}</strong>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Services;