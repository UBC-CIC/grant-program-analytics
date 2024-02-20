import React from 'react';
import styles from "./charts.module.css";
import { PieChart, Pie, Cell, Label } from 'recharts';

function SuccessRateChart({ projects }) {

    const small = [
        {
            "name": "Rejected Small TLEF Projects",
            "value": (62 - 44) / 62,
            "label": `${100 - 71}%`
        },
        {
            "name": "Funded Small TLEF Projects",
            "value": 44 / 62,
            "label": "71%"
        }
    ];

    const large = [
        {
            "name": "Rejected Large TLEF Projects",
            "value": (13 - 10) / 13,
            "label": `${100 - 77}%`
        },
        {
            "name": "Large TLEF Projects",
            "value": 10 / 13,
            "label": "77%"
        }
    ];

    const domain = [0, 1];
    const ticks = [
        0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1
    ];

    const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;

    const getPercent = (value, total) => {
        const ratio = total > 0 ? value / total : 0;

        return toPercent(ratio, 2);
    };

    const customLabel = (props) => {
        const { x, y, width, height, value } = props;
        return (
            <text x={590} y={y + height / 3 * 2} textAnchor="end" fontStyle="italic">
                {value}
            </text>
        )
    }

    return (
        <React.Fragment>
            <div className={styles.chart}>
                <div className={styles.sr}>
                    <div className={styles["sr-pie"]}>
                        <p className={styles["sr-title"]}>Small TLEF Innovation Projects</p>
                        <p className={styles["sr-info"]}>Proposals: 62 | Funded: 44</p>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={small}
                                dataKey={"value"}
                                nameKey={"name"}
                                cx={"50%"}
                                cy={"50%"}
                                innerRadius={80}
                                outerRadius={120}
                                startAngle={-270}
                                endAngle={90}
                            >
                                {small.map((entry, index) => {
                                    if (index == 0) {
                                        return <Cell key={`cell-${index}`} fill="#EEE" />
                                    }
                                    return <Cell key={`cell-${index}`} fill="#FB812D" />
                                })}

                                <Label
                                    value={"71%"}
                                    position={"center"}
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 600
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </div>

                    <div className={styles["sr-pie"]}>
                        <p className={styles["sr-title"]}>Large TLEF Innovation Projects</p>
                        <p className={styles["sr-info"]}>Proposals: 13 | Funded: 10</p>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={large}
                                dataKey={"value"}
                                nameKey={"name"}
                                cx={"50%"}
                                cy={"50%"}
                                innerRadius={80}
                                outerRadius={120}
                                startAngle={-270}
                                endAngle={90}
                            >
                                {small.map((entry, index) => {
                                    if (index == 0) {
                                        return <Cell key={`cell-${index}`} fill="#EEE" />
                                    }
                                    return <Cell key={`cell-${index}`} fill="#13588B" />
                                })}

                                <Label
                                    value={"77%"}
                                    position={"center"}
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: 600
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </div>


                </div>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
                <p>{projects.length} projects received funding during selected TLEF rounds.</p>
            </div>
        </React.Fragment>
    );
};

export default SuccessRateChart;