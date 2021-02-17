import React, { FunctionComponent, useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import ModalWrapper from 'nav-frontend-modal';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veilederen from 'ikoner/varsler/Veiledervarsel';
import './utloggingsvarsel.less';
import { getSelvbetjeningIdtoken, parseJwt } from './token.utils';
import { checkTimeStampAndSetTimeStamp } from './timestamp.utils';

interface Props {}

const Utloggingsvarsel: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('utloggingsvarsel');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [unitTimeStamp, setUnixTimestamp] = useState<number>(0);
    const toggleModal = () => setModalOpen((prevState) => !prevState);

    useEffect(() => {
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
            <button onClick={toggleModal}>TEST MODAL BUTTON</button>
            <ModalWrapper
                onRequestClose={toggleModal}
                contentLabel="varsel for utløpende sesjon av innlogget bruker"
                isOpen={modalOpen}
                className={cls.element('modal')}
            >
                <div className={cls.element('container')}>
                    <Veilederpanel svg={<Veilederen />} fargetema="advarsel">
                        Du er i ferd med å bli logget ut fra din sesjon.
                    </Veilederpanel>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default Utloggingsvarsel;
