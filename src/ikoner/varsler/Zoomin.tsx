import React, { SVGProps } from 'react';

const Zoomin = (props: SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18 9a9 9 0 10-3.39 7.039L22.57 24 24 22.571l-7.961-7.962A8.962 8.962 0 0018 9zM2 9a7 7 0 1114 0A7 7 0 012 9zm8-5v4h4v2h-4v4H8v-4H4V8h4V4h2z"
            fill="#000000"
        />
    </svg>
);
export default Zoomin;
