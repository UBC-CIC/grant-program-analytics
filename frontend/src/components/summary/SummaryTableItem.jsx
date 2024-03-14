import styles from "./SummaryTableItem.module.css";

function SummaryTableItem({ field, data, color }) {

    let dataHTML;

    if (field == "Focus Area(s)") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data.join(", ")}
            </div>
        );

        // dataHTML = (
        //     <div className={styles.data} style={{ backgroundColor: color }}>
        //         {data.map((area) =>
        //             <p style={{ marginBottom: "0.25rem"}}>{area}</p>
        //         )}
        //     </div>
        // )
    } else if (field === "Team Members") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data.map((member) =>
                    <div className={styles.member}>
                        <div className={styles.name}>
                            {member.member_name}
                        </div>
                        <div className={styles.job}>
                            {member.member_title}, {member.member_faculty}
                        </div>
                    </div>
                )}
            </div>
        );
    } else if (field === "Student Reach") {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                <div className={styles.courses}>
                    {data.courses.map((course) => (
                        <div className={styles.course}>{course.course_name} {course.section}</div>
                    ))}
                </div>

                <div className={styles.reach}>
                    {data.count} student impact.
                </div>
            </div>
        )
    } else {
        dataHTML = (
            <div className={styles.data} style={{ backgroundColor: color }}>
                {data}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.field}>
                {field}
            </div>

            {dataHTML}

        </div>
    );
}

export default SummaryTableItem;