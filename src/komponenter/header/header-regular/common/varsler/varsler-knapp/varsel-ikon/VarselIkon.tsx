import React from 'react';
import BEMHelper from 'utils/bem';
import { Undertekst, Systemtittel } from 'nav-frontend-typografi/lib';
import './VarselIkon.less';

type Props = {
    isOpen: boolean;
    antallUleste?: number;
};

export const VarselIkon = ({ isOpen, antallUleste = 0 }: Props) => {
    const cls = BEMHelper('varselbjelle-ikon');

    return (
        <div className={`${cls.className}${isOpen ? ` ${cls.className}--open` : ''}`}>
            <div className={cls.element('ring')} />
            <div className={cls.element('bell')} />
            <div className={cls.element('lip')} />
            <div className={cls.element('clapper')} />
            <div className={cls.element('ulest-sirkel', antallUleste === 0 ? 'hide' : '')}>
                <Undertekst className={cls.element('ulest-antall')}>
                    {antallUleste < 10 ? antallUleste : '9+'}
                </Undertekst>
            </div>
        </div>
    );
};
