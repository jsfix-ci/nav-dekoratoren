import React, { FunctionComponent, useEffect, useState } from 'react';
import { getCurrentTimeStamp, timeStampIkkeUtgatt } from '../timestamp.utils';
import TypografiBase from 'nav-frontend-typografi';

export type TypografiTypes =
    | 'sidetittel'
    | 'innholdstittel'
    | 'systemtittel'
    | 'undertittel'
    | 'ingress'
    | 'element'
    | 'feilmelding'
    | 'normaltekst'
    | 'undertekstBold'
    | 'undertekst';

interface Props {
    timestamp: number;
    typoGrafi: TypografiTypes;
    visTekst?: boolean;
}
const Nedteller: FunctionComponent<Props> = (props) => {
    const [tidIgjen, setTidIgjen] = useState<string>('');
    const tekst = props.visTekst ? 'Tid igjen av sesjonen:' : '';
    useEffect(() => {
        if (timeStampIkkeUtgatt(props.timestamp - getCurrentTimeStamp())) {
            const timeleft = setInterval(() => {
                const tokenExpire = props.timestamp - getCurrentTimeStamp();
                if (timeStampIkkeUtgatt(getCurrentTimeStamp() - props.timestamp + 1)) {
                    clearInterval(timeleft);
                }
                const min = Math.floor(tokenExpire / 60);
                const sek = Math.floor(tokenExpire % 60);
                setTidIgjen(`${tekst} 00t:${min}m:${sek}s`);
            }, 1000);
        }
    }, [props.timestamp]);

    return (
        <div>
            <TypografiBase type={props.typoGrafi}>{tidIgjen}</TypografiBase>
        </div>
    );
};

export default Nedteller;
