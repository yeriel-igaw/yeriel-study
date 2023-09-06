'use client'

import styles from './GNB.module.scss';
import {useRouter} from 'next/navigation';

export default function GNB() {
    const router= useRouter();
    return <nav id={`${styles.GNB}`}>
        <span onClick={()=>router.push('/lineChart')}>LineChart</span>
    </nav>
}