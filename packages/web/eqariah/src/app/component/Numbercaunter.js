import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const NumberCounter = ({ target, label, icon }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Stop observing after the first intersection
                }
            },
            { threshold: 0.5 } // Trigger when 50% of the element is visible
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = parseInt(target);
        const speed = 100; // Adjust the speed of the animation
        const increment = end / speed;

        const updateCount = () => {
            start += increment;
            if (start < end) {
                setCount(Math.ceil(start));
                setTimeout(updateCount, 10); // Control the animation interval
            } else {
                setCount(end);
            }
        };

        updateCount();
    }, [isVisible, target]);

    return (
        <div ref={elementRef} className='flex items-center'>
            <Image src={icon} alt='icon' width={50} height={50} className='mx-[1.5%] md:w-24' />
            <div className='ml-[3%]'>
                <div className="text-[5.5vw] md:text-[4vw] lg:text-3xl font-bold mb-1">{label}</div>
                <div className="text-[6vw] md:text-[4vw] lg:text-2xl font-bold ">{count.toLocaleString()}</div>
            </div>
        </div>
    );
};

export default NumberCounter;
