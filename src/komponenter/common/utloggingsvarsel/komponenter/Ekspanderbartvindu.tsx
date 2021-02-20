import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';
import Clock from '../../../../ikoner/varsler/Clock';
import Close from '../../../../ikoner/varsler/Close';
import BEMHelper from '../../../../utils/bem';
import Nedteller, { TypografiTypes } from './Nedteller';
import CollapseUp from '../../../../ikoner/varsler/CollapseUp';

interface Props {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    setMinimized: Dispatch<SetStateAction<boolean>>;
    timestamp: number;
    typoGrafi: TypografiTypes;
}

const Ekspanderbartvindu: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('utloggingsvarsel');
    const { setMinimized, setModalOpen, timestamp, typoGrafi } = props;
    return (
        <div className={cls.element('minimize-window')}>
            <div className={cls.element('expanderbartvindu')}>
                <Clock />
                <Nedteller timestamp={timestamp} typoGrafi={typoGrafi} />
                <div className={cls.element('expanderbart-nav')}>
                    <button
                        onClick={() => {
                            document.body.style.overflow = 'hidden';
                            setMinimized(false);
                        }}
                    >
                        <CollapseUp width="24" height="20" />
                    </button>
                    <button
                        onClick={() => {
                            setMinimized(false);
                            setModalOpen(false);
                        }}
                    >
                        <Close width="24" height="20" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Ekspanderbartvindu;
