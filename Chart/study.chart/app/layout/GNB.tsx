'use client'

import styles from './GNB.module.scss';
import {useRouter} from 'next/navigation';

export default function GNB() {
    const router= useRouter();
    return <nav id={`${styles.GNB}`}>
        <span onClick={()=>router.push('/line-chart')}>LineChart</span>
        <span onClick={()=>router.push('/venn-diagram')}>VennDiagram</span>
        {/*<span onClick={()=>router.push('/word-cloud')}>WordCloud</span>*/}
    </nav>
}