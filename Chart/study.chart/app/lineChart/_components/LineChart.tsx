'use client';

import styles from './LineChart.module.scss';
import React, {useCallback} from 'react';
import {useEffect, useRef, useState, useTransition} from "react";
import {LabelPosition, LabelPositionType} from "@/tools/Union";

interface Point {
    x: number;
    y: number;
    num: string;
    position: LabelPositionType;
}

const yValues = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
const xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const series1 = Array.from({length: 15}, () => Math.round(Math.random() * 100 * 100) / 100);
// const series1 = Array.from({length: 15}, () => 0);
export default function LineChart() {
    const ref = useRef<HTMLDivElement>(null);
    const [pointList, setPointList] = useState<Point[]>([]);
    const [max, setMax] = useState<number>(0);
    const [gridRowArr,setGridRowArr] = useState<number[]>([]);
    useEffect(() => {
        settingMax();
    }, []);

    


    const settingMax = () => {
        const initMax = Math.max(...series1);
        const maxLength = Math.floor(Math.log10(initMax)) || 1;
        const maxRange = Math.pow(10, maxLength);

        const maximum = Math.floor((maxRange + initMax) / maxRange) * maxRange;
        const ratio = maximum % 3 === 0 ? maximum / 3 : (maximum % 4 === 0 && Number.isInteger(maximum % 4) ? maximum / 4 : maximum / 5);
        setMax(maximum);
        const rows=  Array.from({length:maximum/ratio},(a,i)=>ratio * i).reverse();
        setGridRowArr(rows);
    };


    const settingPointAndPathLit = useCallback(() => {
            const {current} = ref;

            if (!current) return;
            const {width = 0, height = 0} = current.getBoundingClientRect();

            const widthPerPoint = width / xValues.length;
            const leftMargin = widthPerPoint / 2;

            const points = series1.reduce((acc: Point[], curr: number, j: number) => {
                const yRatio = 1 - (curr / max);
                // console.log(height,yRatio)
                const point: Point = {
                    x: leftMargin + (widthPerPoint * j),
                    y: height * yRatio,
                    num: String(curr),
                    position: LabelPosition.Top
                };
                acc.push(point);
                return acc
            }, []);
            setPointList(points);
        }, [max]);


    useEffect(() => {
        settingPointAndPathLit();
    }, [settingPointAndPathLit]);

    const renderGrid = () => {
        return <React.Fragment>
            {xValues.map((xValue,cIndex) => (
                <span className={`${styles.grid_column}`} key={`colum-${cIndex}`}>
                    {gridRowArr.map((yValue,rIndex) => {
                        return <React.Fragment>{ cIndex === 0 ?
                            <span className={`${styles.grid_row}`} key={`row-${rIndex}`}>
                                <span className={`${styles.data_label}`}>{yValue}</span>
                            </span>
                            :
                            <span className={`${styles.grid_row}`} key={`row-${rIndex}`}>
                        </span>
                        }</React.Fragment>
                    }

                    )}
                </span>
            ))}
            <span className={`${styles.grid_column} ${styles.blank}`}>
                {gridRowArr.map((yValue) => (
                    <span className={`${styles.grid_row}`} key={`row-${yValue}`}>
                        </span>
                ))}
            </span>
        </React.Fragment>

    };

    const renderChart = () => {
        return <div className={`${styles.chart}`}>
            {pointList && pointList.map((point: Point, index) => {
                return <span className={`${styles.point}`}
                             key={`point-${index}`}
                             style={{
                                 top: `${point.y}px`,
                                 left: `${point.x}px`
                             }}><span>{point.num}</span></span>
            })}
        </div>
    };


    return <article className={`${styles.lineChart}`}>
        <section className={`${styles.chartBody}`}>


            <div className={`${styles.chartContainer}`}>
                <span className={`${styles.grid}`} ref={ref}>
                    {renderGrid()}
                    {renderChart()}
                </span>

                <div className={`${styles.x_axis_container}`}>
                    <div className={`${styles.x_values}`}>
                        {xValues.map((x) => <span key={`x-${x}`}>{x}</span>)}
                    </div>
                </div>
            </div>
        </section>
    </article>
}