import React, { FunctionComponent, useEffect, useState } from 'react';
import { getCurrentTimeStamp, timeStampIkkeUtgatt } from './timestamp.utils';
import { Ingress } from 'nav-frontend-typografi';

interface Props {
    timestamp: number;
}

const Nedteller: FunctionComponent<Props> = (props) => {
    const [tidIgjen, setTidIgjen] = useState<string>('');
    useEffect(() => {
        if (timeStampIkkeUtgatt(props.timestamp - getCurrentTimeStamp())) {
            const timeleft = setInterval(() => {
                const tokenExpire = props.timestamp - getCurrentTimeStamp();
                if (timeStampIkkeUtgatt(getCurrentTimeStamp() - props.timestamp + 1)) {
                    clearInterval(timeleft);
                }
                const min = Math.floor(tokenExpire / 60);
                const sek = Math.floor(tokenExpire % 60);
                setTidIgjen(`Tid igjen av sesjonen: 00t:${min}m:${sek}s`);
            }, 1000);
        }
    }, [props.timestamp]);

    return (
        <div>
            <Ingress>{tidIgjen}</Ingress>
        </div>
    );
};

export default Nedteller;
