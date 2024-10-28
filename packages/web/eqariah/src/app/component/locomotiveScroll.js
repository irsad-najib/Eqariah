"use client";
import React, { useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import "locomotive-scroll/src/locomotive-scroll.scss";

const LocomotiveScroll = dynamic(() => import('locomotive-scroll'), { ssr: false });

export default function LocomotiveScrollWrapper({ children }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        let locomotiveScroll;
        if (scrollRef.current) {
            locomotiveScroll = new LocomotiveScroll({
                el: scrollRef.current,
                smooth: true,
            });
        }

        return () => {
            if (locomotiveScroll) locomotiveScroll.destroy();
        };
    }, []);

    return <div ref={scrollRef}>{children}</div>;
}
