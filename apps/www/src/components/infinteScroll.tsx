'use client'
import React, { useEffect, useRef } from 'react';

const InfiniteScroll = ({ loadMore, hasNextPage }: any) => {
    const observer: any = useRef();

    const lastElementRef = useRef<any>();

    useEffect(() => {
        const currentObserver = observer.current;

        const callback = (entries: any) => {
            if (entries[0].isIntersecting && hasNextPage) {
                loadMore();
            }
        };

        if (currentObserver) {
            currentObserver.disconnect();
        }

        const newObserver = new IntersectionObserver(callback);
        observer.current = newObserver;

        if (lastElementRef.current) {
            newObserver.observe(lastElementRef.current);
        }

        return () => {
            if (currentObserver) {
                currentObserver.disconnect();
            }
        };
    }, [hasNextPage, loadMore]);

    return (
        <div>
            {/* Your content here */}
            <div ref={lastElementRef} style={{ height: '20px' }} />
        </div>
    );
};

export default InfiniteScroll;
