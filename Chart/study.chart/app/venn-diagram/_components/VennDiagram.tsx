'use client';

import styles from './VennDiagram.module.scss';
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";


interface RefSize {
    width: number,
    height: number
}

export default function VennDiagram() {
    const ref = useRef<HTMLElement>(null);
    const [refSize, setRefSize] = useState<RefSize>({width: 0, height: 0});


    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    const handleResize = () => {
        const {width = 0, height = 0} = ref.current?.getBoundingClientRect() || {};
        setRefSize({width, height});
    };

    const side = useMemo(() => {
        const {width, height} = refSize;
        return Math.floor(Math.min(width, height) / 4);
    }, [refSize]);

    const centerPosition = useMemo(() => {
        return {x: refSize.width / 2, y: refSize.height / 2};
    }, [refSize]);


    const circleTwoContactPosition = (x1: number, y1: number, x2: number, y2: number) => {

        if (x1 === 0) {
            return {cx1: 0, cy1: 0, cx2: 0, cy2: 0}
        }
        let xx = x2 - x1;
        let yy = y2 - y1;
        const D = Math.sqrt((xx ** 2) + (yy ** 2));//두 중심의 거리
        const T1 = Math.acos((side * side - side * side + D * D) / (2 * side * D));
        const T2 = Math.atan(yy / xx);
        const T3 = x1 + side * Math.cos(T2 + T1); //AB
        const T4 = y1 + side * Math.sin(T2 + T1); //AB
        const T5 = x1 + side * Math.cos(T2 - T1); //AB
        const T6 = y1 + side * Math.sin(T2 - T1); //AB

        return {cx1: T3, cy1: T4, cx2: T5, cy2: T6}
    };


    const renderTwoVennDiagram = useCallback(() => {
            const {width, height} = refSize;
            const {x: centerX, y: centerY} = centerPosition;
            const rectSide = side / 24;

            const x1 = centerX - side / 2;
            const y1 = centerY;
            const x2 = centerX + side / 2;
            const y2 = centerY;

            const {cx1: cX1, cy1: cY1, cx2: cX2, cy2: cY2} = circleTwoContactPosition(x1, y1, x2, y1);

            return <React.Fragment>
                <svg width={width} height={height}>
                    <g>
                        <path className={"A"}
                              d={`M ${cX1},${cY1} A ${side},${side} 0 1,1 ${cX2},${cY2} A ${side},${side} 0 0,0 ${cX1},${cY1}`}/>
                        <path className={"B"}
                              d={`M ${cX1},${cY1} A ${side},${side} 0 0,0 ${cX2},${cY2} A ${side},${side} 0 1,1 ${cX1},${cY1}`}/>
                        <path className={"AB"}
                              d={`M ${cX1},${cY1} A ${side},${side} 0 0,0 ${cX2},${cY2} A ${side},${side} 0 0,0 ${cX1},${cY1}`}/>
                    </g>
                </svg>
            </React.Fragment>
        }, [refSize],
    );

    return <section className={`${styles.VennDiagram}`} ref={ref}>
        {renderTwoVennDiagram()}
    </section>
}