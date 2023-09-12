import styles from "./VennDiagramPage.module.scss";
import VennDiagram from "@/app/venn-diagram/_components/VennDiagram";

export default function VennDiagramChart() {
    return <article id={`${styles.VennDiagramPage}`} className={`mainContent`}>
        <div className={`${styles.basic}`}>
            <VennDiagram/>
        </div>
    </article>
}