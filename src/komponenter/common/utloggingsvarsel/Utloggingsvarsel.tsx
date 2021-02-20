import React, { FunctionComponent, useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import ModalWrapper from 'nav-frontend-modal';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veilederen from 'ikoner/varsler/Veiledervarsel';
import './utloggingsvarsel.less';
import './utloggingsmodal-transition.less';
import { getSelvbetjeningIdtoken, parseJwt } from './token.utils';
import { checkTimeStampAndSetTimeStamp } from './timestamp.utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import UtloggingNavigasjon from './komponenter/UtloggingNavigasjon';
import Nedteller from './komponenter/Nedteller';
import UtloggingsvarselValg from './komponenter/UtloggingsvarselValg';
import Ekspanderbartvindu from './komponenter/Ekspanderbartvindu';

const Utloggingsvarsel: FunctionComponent = () => {
    const cls = BEMHelper('utloggingsvarsel');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [unitTimeStamp, setUnixTimestamp] = useState<number>(0);
    const [minimized, setMinimized] = useState<boolean>(false);
    const setOpenClsName = (): string => (minimized ? '' : 'open');
    const toggleModal = (): void => setModalOpen((prevState) => !prevState);
    const modalMountPoint = (): HTMLElement => document.getElementById('utloggingsvarsel') ?? document.body;

    useEffect(() => {
        const setModalElement = () => (document.getElementById('sitefooter') ? '#sitefooter' : 'body');
        ModalWrapper.setAppElement(setModalElement());

        const token = getSelvbetjeningIdtoken();
        if (token) {
            try {
                const jwt = parseJwt(token);
                const timestamp = jwt['exp'];
                if (timestamp) {
                    checkTimeStampAndSetTimeStamp(timestamp, setModalOpen, setUnixTimestamp);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }, []);

    return (
        <div id="utloggingsvarsel" className={cls.className + ` ${setOpenClsName()}`}>
            <ModalWrapper
                parentSelector={modalMountPoint}
                onRequestClose={toggleModal}
                contentLabel="varsel for utløpende sesjon av innlogget bruker"
                isOpen={modalOpen}
                className={cls.element('modal')}
                closeButton={false}
            >
                <div className={cls.element('container')}>
                    <UtloggingNavigasjon setModalOpen={setModalOpen} setMinimized={setMinimized} />
                    <Veilederpanel svg={<Veilederen />} fargetema="advarsel">
                        <Element className={cls.element('heading')}>Du er i ferd med å bli logget ut</Element>
                        <Normaltekst>
                            Dette kan medføre at ulagret data som ikke er sendt inn vil gå tapt. Det anbefales derfor å
                            lagre informasjonen og logget inn på nytt via ID-porten.
                        </Normaltekst>
                    </Veilederpanel>
                    <UtloggingsvarselValg toggleModal={toggleModal} />
                    <Nedteller timestamp={unitTimeStamp} typoGrafi="ingress" visTekst={true} />
                </div>
            </ModalWrapper>
            <Ekspanderbartvindu
                setMinimized={setMinimized}
                setModalOpen={setModalOpen}
                timestamp={unitTimeStamp}
                typoGrafi="undertekst"
            />
        </div>
    );
};

export default Utloggingsvarsel;
