import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";

const COLORS = {
    TRACE: "#8A9BA1",
    DEBUG: "#218DAE",
    INFO: "#2BBBD7",
    WARN: "#FFD758",
    ERROR: "#DC4C4C",
    FATAL: "#9F2D2D"
};

const SeverityChart = ({ data }) => {

    const chartData = Object.entries(
        data || {}
    )
        .map(([name, value]) => ({
            name,
            value
        }))
        .filter((item) => item.value > 0);

    const total = chartData.reduce(
        (sum, item) =>
            sum + item.value,
        0
    );

    return (
        <div className="chart-card">

            <div className="chart-header">
                <div>
                    <h3>
                        Severity Distribution
                    </h3>

                    <p>
                        Logs grouped by severity
                    </p>
                </div>
            </div>

            <div className="severity-chart-layout">

                <div className="pie-wrapper">

                    {total === 0 ? (

                        <div className="chart-empty">
                            No data
                        </div>

                    ) : (

                        <>
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <PieChart>

                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="62%"
                                        outerRadius="85%"
                                        paddingAngle={3}
                                    >

                                        {chartData.map(
                                            (entry) => (

                                                <Cell
                                                    key={
                                                        entry.name
                                                    }
                                                    fill={
                                                        COLORS[
                                                            entry
                                                                .name
                                                        ]
                                                    }
                                                />

                                            )
                                        )}

                                    </Pie>

                                    <Tooltip />

                                </PieChart>

                            </ResponsiveContainer>

                            <div className="pie-center">
                                <strong>
                                    {total}
                                </strong>

                                <span>
                                    Logs
                                </span>
                            </div>
                        </>

                    )}

                </div>

                <div className="severity-legend">

                    {chartData.map((item) => (

                        <div
                            className="legend-row"
                            key={item.name}
                        >

                            <div className="legend-name">

                                <span
                                    className="legend-color"
                                    style={{
                                        background:
                                            COLORS[
                                                item.name
                                            ]
                                    }}
                                ></span>

                                {item.name}

                            </div>

                            <strong>
                                {item.value}
                            </strong>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
};

export default SeverityChart;