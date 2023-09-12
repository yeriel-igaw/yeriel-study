import LineChart from "@/app/line-chart/_components/LineChart";
import styles from "./lineChartPage.module.scss";

export default function LineChartPage() {
    return <article id={`${styles.lineChartPage}`} className={`mainContent`}>
        <div className={`${styles.basic}`}>
            <LineChart/>
        </div>
    </article>
}