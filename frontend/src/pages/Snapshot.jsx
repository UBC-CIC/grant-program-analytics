import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SnapshotHeader, SnapshotBox } from "../components/snapshot";
import { FundingChart, NumGrantsChart, NumProjectsChart, StudentReachChart, TeamMemberChart, SuccessRateChart } from "../components/charts";
import { Project, BASE_URL } from "../constants";
import styles from "./Snapshot.module.css";
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api'
import config from '../aws-exports';

Amplify.configure(config);

function Snapshot() {

    const query = `query test {
        proposals(method: "all") {
            grant_id
            pi_name
            faculty
            title
            project_year
            amount
        }
    }
    `;

    const location = useLocation();
    const { projects, filters, range } = location.state;

    const [selectedProjects, setSelectedProjects] = useState(projects);
    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [selectedRange, setSelectedRange] = useState(range);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const client = generateClient()
                const results = await client.graphql({
                    query: query,
                });

                const proposals = results.data.proposals;
                const newProjects = proposals.map((proj) => {
                    return new Project(
                        proj.grant_id,
                        "2024/2025",
                        "Small TLEF",
                        proj.pi_name,
                        (proj.faculty.includes("Faculty of ")) ? proj.faculty.replace("Faculty of ", "") : proj.faculty,
                        proj.title,
                        proj.project_year,
                        proj.amount,
                        "Active"
                    );
                });

                console.log(newProjects);
                       
                setSelectedProjects(newProjects);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, [appliedFilters]);

    // useEffect(() => {
    //     const fetchFilteredData = async () => {
    //         try {
    //             const res = await fetch(BASE_URL + "filter", {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json", },
    //                 body: JSON.stringify({ appliedFilters }),
    //             });
    //             if (!res.ok) throw new Error("Network response was not ok");

    //             const data = await res.json();
    //             const newProjects = data.map((proj) => {

    //                 // Make sure to return the new Project instance
    //                 return new Project(
    //                     proj.ID,
    //                     proj.FundingYear,
    //                     proj.ProjectType,
    //                     proj.Investigator,
    //                     proj.Faculty,
    //                     proj.Title,
    //                     "1",
    //                     proj.Amount,
    //                     proj.ProjectStatus
    //                 );
    //             });

    //             setSelectedProjects(newProjects);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };

    //     fetchFilteredData();
    // }, [appliedFilters]);

    const handleClick = (section) => {
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
    };

    const charts = {
        successRate: (<SuccessRateChart projects={selectedProjects} />),
        numGrants: (<NumGrantsChart projects={selectedProjects} />),
        numProjects: (<NumProjectsChart projects={selectedProjects} />),
        funding: (<FundingChart projects={selectedProjects} />),
        studentReach: (<StudentReachChart projects={selectedProjects} filters={appliedFilters} />),
        teamMember: (<TeamMemberChart projects={selectedProjects} filters={appliedFilters} />)
    };

    return (
        <div className={styles.Snapshot}>

            <SnapshotHeader filters={appliedFilters} setFilters={setAppliedFilters} range={selectedRange} setRange={setSelectedRange} />

            <div className={styles.navbar}>
                <button onClick={() => handleClick("success-rate")}>Success Rate</button>
                <button onClick={() => handleClick("num-grants")}>Number of Grants</button>
                <button onClick={() => handleClick("num-projects")}>Number of Projects</button>
                <button onClick={() => handleClick("funding")}>Funding Awarded</button>
                <button onClick={() => handleClick("student-reach")}>Student Reach</button>
                <button onClick={() => handleClick("faculty-engagement")}>Faculty Engagement</button>
            </div>

            <section id="success-rate"> <SnapshotBox chart={charts.successRate} type={1} title="Success Rate" /></section>
            <section id="num-grants"> <SnapshotBox chart={charts.numGrants} type={0} title="Number of Grants" /> </section>
            <section id="num-projects"> <SnapshotBox chart={charts.numProjects} type={1} title="Number of Projects" /> </section>
            <section id="funding"> <SnapshotBox chart={charts.funding} type={0} title="Funding Awarded" /> </section>
            <section id="student-reach"> <SnapshotBox chart={charts.studentReach} type={1} title="Student Reach" /> </section>
            <section id="faculty-engagement"> <SnapshotBox chart={charts.teamMember} type={0} title="Faculty Engagement" /> </section>
        </div>
    );
};

export default Snapshot;