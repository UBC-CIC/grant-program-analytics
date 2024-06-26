import styles from "./Posters.module.css";

function Posters({ posters }) {

    let slideIndex = 0;

    const plusDivs = (n) => {
        showDivs(slideIndex += n);
    };

    const showDivs = (n) => {
        let i;
        let x = document.getElementsByClassName(styles.slideElement);
        if (n >= x.length) slideIndex = 0;
        if (n < 0) slideIndex = x.length - 1;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[slideIndex].style.display = "flex";
    };

    if (posters.length === 0) return null;

    return (
        <div className={styles.bg}>
            <div className={styles.title}>
                TLEF Showcase
            </div>

            <div className={styles.container}>
                <button className={styles.btn} onClick={() => plusDivs(-1)}>&lt;</button>

                {
                    posters.map((p, i) => (
                        <div className={styles.slideElement} style={{ display: (i !== slideIndex) && 'none' }} >
                            <div>Year {p.year}</div>
                            <a href={p.poster} target="_blank" style={{ cursor: "pointer" }}>
                                <img src={p.poster} className={styles.poster} />
                            </a>
                        </div>
                    ))
                }

                <button className={styles.btn} onClick={() => { plusDivs(1) }}>&gt;</button>
            </div>
        </div >
    );
}

export default Posters;