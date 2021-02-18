import React, { FunctionComponent, useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import ModalWrapper from 'nav-frontend-modal';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veilederen from 'ikoner/varsler/Veiledervarsel';
import './utloggingsvarsel.less';
import { getSelvbetjeningIdtoken, parseJwt } from './token.utils';
import { checkTimeStampAndSetTimeStamp } from './timestamp.utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import UtloggingNavigasjon from './UtloggingNavigasjon';
import Nedteller from './Nedteller';
import UtloggingsvarselValg from './UtloggingsvarselValg';

const Utloggingsvarsel: FunctionComponent = () => {
    const cls = BEMHelper('utloggingsvarsel');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [unitTimeStamp, setUnixTimestamp] = useState<number>(0);
    const toggleModal = () => setModalOpen((prevState) => !prevState);
    const modalMountPoint = () => document.getElementById('decorator-wrapper-footer') ?? document.body;

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
        <div className={cls.className}>
            {/* <button onClick={toggleModal}>TEST MODAL BUTTON</button>*/}
            <ModalWrapper
                parentSelector={modalMountPoint}
                onRequestClose={toggleModal}
                contentLabel="varsel for utløpende sesjon av innlogget bruker"
                isOpen={modalOpen}
                className={cls.element('modal')}
                closeButton={false}
            >
                <div className={cls.element('container')}>
                    <UtloggingNavigasjon setModalOpen={setModalOpen} />
                    <Veilederpanel svg={<Veilederen />} fargetema="advarsel">
                        <Element className={cls.element('heading')}>Du er i ferd med å bli logget ut</Element>
                        <Normaltekst>
                            Dette kan medføre at ulagret data som ikke er sendt inn vil gå tapt. Det anbefales derfor å
                            lagre informasjonen og logget inn på nytt via ID-porten.
                        </Normaltekst>
                    </Veilederpanel>
                    <UtloggingsvarselValg toggleModal={toggleModal} />
                    <Nedteller timestamp={unitTimeStamp} />
                </div>
            </ModalWrapper>
        </div>
    );
};

export default Utloggingsvarsel;
