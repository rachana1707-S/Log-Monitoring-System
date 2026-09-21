import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const LogsOverTimeChart = ({ data }) => {

    return (
        <div className="chart-card large-chart">

            <div className="chart-header">
                <div>
                    <h3>Logs Over Time</h3>

                    <p>
                        Log volume received by LogPulse
                    </p>
                </div>

                <span className="chart-badge">
                    Live
                </span>
            </div>

            <div className="chart-content">

                {data.length === 0 ? (

                    <div className="chart-empty">
                        No log activity yet
                    </div>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0
                            }}
                        >

                            <defs>

                                <linearGradient
                                    id="logGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="5%"
                                        stopColor="#2BBBD7"
                                        stopOpacity={0.35}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor="#2BBBD7"
                                        stopOpacity={0}
                                    />

                                </linearGradient>

                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E5EEF0"
                            />

                            <XAxis
                                dataKey="time"
                                tick={{
                                    fontSize: 11,
                                    fill: "#71858C"
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fontSize: 11,
                                    fill: "#71858C"
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border:
                                        "1px solid #E1ECEF",
                                    fontSize: "12px"
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#218DAE"
                                strokeWidth={2.5}
                                fill="url(#logGradient)"
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>
    );
};

export default LogsOverTimeChart;