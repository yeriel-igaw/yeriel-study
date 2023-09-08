'use client';

import styles from './LineChart.module.scss';
import React, {useCallback, useMemo} from 'react';
import {useEffect, useRef, useState, useTransition} from "react";
import {LabelPosition, LabelPositionType} from "@/tools/Union";
import {Simulate} from "react-dom/test-utils";
import mouseOver = Simulate.mouseOver;

interface Point {
    x: number;
    y: number;
    num: string;
    position: LabelPositionType;
}

interface Path {
    x: number;
    y: number;
}

interface RefSize {
    width: number;
    height: number
}

interface Tooltip {
    index: number;
    y:number;
    content: TooltipContent[];
}

interface TooltipContent {
    label: string;
    value: number;
}

const yValues = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
const xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function LineChart() {
    const ref = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const [pointList, setPointList] = useState<Point[][]>([]);
    const [pathList, setPathList] = useState<Path[][][]>([[]]);
    const [refSize, setRefSize] = useState<RefSize>({width: 0, height: 0});
    const [toolTip, setToolTip] = useState<Tooltip>({index: -1, y:-1,content: []});


    useEffect(() => {
        window.addEventListener('resize', settingPointAndPathLit);
        return () => {
            window.removeEventListener('resize', settingPointAndPathLit);
        };
    }, []);

    const seriesValue = useMemo(() => {
        const series1 = Array.from({length: 15}, () => Math.round(Math.random() * 100 * 100) / 100);
        const series2 = Array.from({length: 15}, () => Math.round(Math.random() * 100 * 100) / 100);
        return [series1, series2];
    }, []);

    const maxValue = useMemo(() => {
        const initMax = Math.max(...seriesValue.flat());
        const maxLength = Math.floor(Math.log10(initMax)) || 1;
        const maxRange = Math.pow(10, maxLength);
        const maximum = Math.floor((maxRange + initMax) / maxRange) * maxRange;
        return maximum;
    }, [seriesValue]);

    const gridRowArrValue = useMemo(() => {
        const ratio = maxValue % 3 === 0 ? maxValue / 3 : (maxValue % 4 === 0 && Number.isInteger(maxValue % 4) ? maxValue / 4 : maxValue / 5);
        const rows = Array.from({length: maxValue / ratio}, (a, i) => ratio * i).reverse();
        return rows;
    }, [maxValue]);


    const settingPointAndPathLit = useCallback(() => {
        const {current} = ref;

        if (!current) return;

        const {width = 0, height = 0} = current.getBoundingClientRect();
        const widthPerPoint = width / xValues.length;
        const leftMargin = widthPerPoint / 2;

        setRefSize({width, height});

        const points = seriesValue.map((series, i) =>
            series.reduce((acc: Point[], curr: number, j: number) => {
                const yRatio = 1 - (curr / maxValue);
                const point: Point = {
                    x: leftMargin + (widthPerPoint * j),
                    y: height * yRatio,
                    num: String(curr),
                    position: LabelPosition.Top
                };
                acc.push(point);
                return acc
            }, []));

        setPointList(points);

        const paths = seriesValue.map((series) => {
            let tmpArr: Path[] = [];
            const path = series.reduce((acc: Path[][], curr: number, i) => {
                const yRatio = 1 - (curr / maxValue);
                tmpArr.push({
                    x: leftMargin + (widthPerPoint * i),
                    y: height * yRatio
                })
                if (i === series.length - 1) {
                    acc.push(tmpArr);
                }
                return acc;
            }, []);
            return path;
        });

        setPathList(paths);

    }, [maxValue]);


    useEffect(() => {
        settingPointAndPathLit();
    }, [settingPointAndPathLit]);

    const handleMouseOver = (index: number) => (event: React.MouseEvent<HTMLSpanElement>) => {
        const content = seriesValue.reduce((acc: TooltipContent[], curr, i) => {
            const label = i === 0 ? "red" : "blue";
            const value = curr[index];
            acc.push({label, value});
            return acc
        }, []);
        console.log(index,event.pageY,maskRef.current?.getBoundingClientRect().top);
        const y = event.pageY - maskRef.current?.getBoundingClientRect().top;
        setToolTip({index, content,y});



    }


    const renderGrid = useCallback(() => {

        return <React.Fragment>
            {xValues.map((xValue, cIndex) => (
                <span className={`${styles.grid_column}`} key={`colum-${cIndex}`}>
                    {gridRowArrValue.map((yValue, rIndex) => {
                            return <React.Fragment key={`row-${rIndex}`}>{cIndex === 0 ?
                                <span className={`${styles.grid_row}`}>
                                    {rIndex === 0 &&
                                        <span className={`${styles.data_label} ${styles.max}`}>{maxValue}</span>}
                                    <span className={`${styles.data_label}`}>{yValue}</span>
                            </span>
                                :
                                <span className={`${styles.grid_row}`} key={`row-${rIndex}`}/>
                            }</React.Fragment>
                        }
                    )}
                </span>
            ))}
            <span className={`${styles.grid_column} ${styles.blank}`}>
                {gridRowArrValue.map((yValue) => (
                    <span className={`${styles.grid_row}`} key={`row-${yValue}`}/>
                ))}
            </span>
        </React.Fragment>

    }, [gridRowArrValue]);

    const renderPath = useCallback(() => {
            return <svg className={`${styles.path_canvas}`}
                        style={{width: refSize.width, height: refSize.height}}
                        viewBox={`0 0 ${refSize.width} ${refSize.height}`}>
                {pathList.map((path, i) => {
                    return <g key={`line-group-${i}`}>
                        {path.map((p, a) => {
                            const dArr = p.map((position, z) => {
                                return z === 0 ? `M ${position.x} ${refSize.height} L ${position.x} ${position.y}` :
                                    z === p.length - 1 ? `L ${position.x} ${position.y} L ${position.x} ${refSize.height} Z` : `L ${position.x} ${position.y}`
                            });
                            const d = dArr.join(" ");
                            return <path className={`${styles.area}`} d={`${d}`} key={`line-area-${a}`}/>
                        })}
                        {path.map((p, l) => {
                            const dArr = p.map((position, z) => z === 0 ? `M ${position.x} ${position.y}` : `L ${position.x} ${position.y}`);
                            const d = dArr.join(" ");
                            return <path key={`line-${l}`} className={`${styles.line}`} d={`${d}`}/>
                        })}
                    </g>
                })}
                <defs>
                    <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-b)" stopOpacity="20%"/>
                        <stop offset="100%" stopColor="rgba(51, 83, 251, 0)" stopOpacity="100%"/>
                    </linearGradient>
                    <linearGradient id="red-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-r)" stopOpacity="20%"/>
                        <stop offset="100%" stopColor="rgba(251, 51, 99, 0)" stopOpacity="100%"/>
                    </linearGradient>
                    <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-p)" stopOpacity="20%"/>
                        <stop offset="100%" stopColor="rgba(151, 77, 244, 0)" stopOpacity="100%"/>
                    </linearGradient>
                </defs>

            </svg>
        }, [pathList]
    );


    const renderChart = useCallback(
        () => {
            return <div className={`${styles.chart}`}>
                {pointList.length > 0 && pointList.map((point: Point[], index) => {
                    return <div className={`${styles.point_group}`} key={`point-${index}`}>
                        {point.map((p, i) => {
                            return <span className={`${styles.point} ${styles[`group_${index}`]}`}
                                         key={`point-${index}-${i}`}
                                         style={{
                                             top: `${p.y}px`,
                                             left: `${p.x}px`
                                         }}><span>{p.num}</span>
                </span>
                        })
                        }</div>
                })}
            </div>
        }, [pointList]
    );

    const renderOverMask = () => {
        return <div className={`${styles.mask}`} ref={maskRef}>
            {xValues.map((mask, i) => {
                return <span key={`mask-${i}`} className={`${styles.mask_column}`}
                             onMouseMove={handleMouseOver(i)}
                onMouseLeave={()=>setToolTip({index:-1,y:-1,content:[]})}>
                                {i === toolTip.index && <> <span className={`${styles.tooltip_y_axis}`}/>
                                    <div className={`${styles.toolTip}`} style={{top:toolTip.y}}>
                                        {
                                            toolTip.content.map((c, j) => {
                                                return <span key={`tooltip-content-${j}`}>
                                                    <label>{c.label}</label>
                                                    <span>{c.value}</span>
                                                </span>
                                            })}
                                    </div>
                                </>}
            </span>
            })}

        </div>
    };


    return <article className={`${styles.lineChart}`}>
        <section className={`${styles.chartBody}`}>

            <div className={`${styles.chartContainer}`}>
                <span className={`${styles.grid}`} ref={ref}>
                    {renderGrid()}
                    {renderPath()}
                    {renderChart()}
                    {renderOverMask()}
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