import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const ServiceActivityChart = ({ data }) => {

    const chartData = Object.entries(
        data || {}
    )
        .map(([service, count]) => ({
            service,
            count
        }))
        .sort(
            (first, second) =>
                second.count - first.count
        );

    return (
        <div className="chart-card service-chart-card">

            <div className="chart-header">
                <div>
                    <h3>
                        Service Activity
                    </h3>

                    <p>
                        Log volume by application service
                    </p>
                </div>
            </div>

            <div className="service-chart-content">

                {chartData.length === 0 ? (

                    <div className="chart-empty">
                        No service activity yet
                    </div>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 15,
                                left: 20,
                                bottom: 5
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="#E5EEF0"
                            />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 10,
                                    fill: "#71858C"
                                }}
                            />

                            <YAxis
                                type="category"
                                dataKey="service"
                                width={110}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 10,
                                    fill: "#45585F"
                                }}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="count"
                                fill="#2BBBD7"
                                radius={[0, 6, 6, 0]}
                                barSize={16}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default ServiceActivityChart;