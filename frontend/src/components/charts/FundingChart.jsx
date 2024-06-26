import { Bar, BarChart, LabelList, Legend, Rectangle, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import React from 'react';
import styles from "./charts.module.css";

function FundingChart({ projects }) {

    const len = projects.length;

    const formattedAmount = (amount) => {
        return (
            parseInt(amount).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
                minimumFractionDigits: 0
            })
        )
    };


    const fundingData = () => {
        const map = new Map();
        let total = 0;
        projects.forEach((project) => {
            const t = project.project_type === 'Large' || project.project_type === "Flexible Learning" ? 'Large' : 'Small';
            const f = project.project_faculty;
            const a = project.funding_amount;

            if (map.has(f)) {
                let newVal = map.get(f);
                newVal[t] = newVal[t] + a;
                map.set(f, newVal);
            } else {
                let newVal = {
                    "Large": 0,
                    "Small": 0
                };
                newVal[t] = a;
                map.set(f, newVal);
            }

            total += a;
        });
        const res = [];
        for (let [faculty, value] of map) {
            const amount = value["Large"] + value["Small"];
            const percentage = Math.round((amount / total) * 100 * 10) / 10;
            const data = {
                "name": faculty,
                "Large TLEF": value["Large"],
                "Small TLEF": value["Small"],
                "value": amount,
                "label": `${formattedAmount(amount)} (${percentage}%)`
            };
            res.push(data);
        }

        return { res, total };
    };

    const { res, total } = fundingData();

    const isMobile = () => {
        return window.screen.width <= 576;
    }

    const CustomToolTip = ({ active, payload, label }) => {

        if (active && payload && label) {
            return (
                <div className={styles["funding-tooltip"]}>
                    <span className={styles["funding-tooltip-title"]}>
                        {label}
                    </span>
                    <div className={styles["funding-tooltip-content"]}>
                        <span style={{ color: "#FB812D" }}>Small TLEF: {formattedAmount(payload[0].payload["Small TLEF"])}</span>
                        <br />
                        <span style={{ color: "#13588B" }}>Large TLEF: {formattedAmount(payload[0].payload["Large TLEF"])}</span>
                        <br />
                        <span style={{ fontWeight: 600 }}> Total: {payload[0].payload.label}</span>
                    </div>
                </div>
            );
        }

        return null;
    }

    const customLabel = (props) => {
        const { x, y, width, height, value } = props;
        return (
            <text x={width} y={y + height / 3 * 2} textAnchor="end" fill="#081252" fontStyle="italic">
                {value}
            </text>
        )
    }

    const xAxis = (isMobile())
        ? (<XAxis type="category" />) : (<XAxis type="number" padding={{ right: 150 }} />);

    const yAxis = (isMobile())
        ? (<YAxis type="number" padding={{ top: 150 }} hide />) : (<YAxis type="category" dataKey="name" width={120} />);

    const label = (isMobile())
        ? null : <LabelList width='98%' content={customLabel} position="right" dataKey="label" fill="#081252" style={{ fontStyle: "italic" }} />;


    const hasData = projects && projects.length > 0;

    if (!hasData) {
        return <div> No summaries matching this criteria. </div>;
    }
    return (
        <React.Fragment>
            <div className={styles.chart}>
            <ResponsiveContainer width='100%' height={600} maxHeight={800}>
                <BarChart width={800} height={500} layout='vertical' data={res} alt="Funding Amount Chart">
                <XAxis type="number" padding={{ right: 150 }} hide="true" />
                <YAxis type="category" dataKey="name" width={120} interval={0} padding={{left: 200}}/>
                    {isMobile() && <Tooltip content={<CustomToolTip />} wrapperStyle={{ backgroundColor: "white"}}/>}
                    <Tooltip content={CustomToolTip}/>
                    <Legend verticalAlign='top' iconType='square' height={36} />
                    <Bar dataKey="Small TLEF" stackId="a" maxBarSize={120} background={{ fill: "#EEEE" }} fill="#FB812D" />
                    <Bar dataKey="Large TLEF" stackId="a"maxBarSize={120} fill="#2F5D7C">{label}</Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.space}></div>
            <div className={styles.description}>
            <p className={styles["chart-annotation"]}>
                    Hover/click on the bars to display further data 
                 </p>
                The TLEF awarded the total of <b>{formattedAmount(total)}</b> funding for {len} selected projects.
                <div className={styles.dataBox}>
                    <h3 className={styles['hidden']}>Chart Data</h3>
                    {res.map((item, index) => (
                        <div key={index} className={styles.valueColumn}>
                            <span className={styles.valueFaculty}><b className={styles['hidden']}>{item.name}: </b></span>
                            {(item['Small TLEF'] !== 0) && (
                            <span className={styles.valueSmall}>Small: {formattedAmount(item['Small TLEF'])}</span>
                            )}
                            {(item['Large TLEF'] !== 0) && (
                            <span className={styles.valueLarge}>Large: {formattedAmount(item['Large TLEF'])}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        
            
        </React.Fragment>
    );
};

export default FundingChart;