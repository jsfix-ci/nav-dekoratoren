import React, { FunctionComponent, useEffect, useState } from 'react';
import BEMHelper from '../../../utils/bem';
import ModalWrapper from 'nav-frontend-modal';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veilederen from 'ikoner/varsler/Veiledervarsel';
import './utloggingsvarsel.less';
import { getSelvbetjeningIdtoken, parseJwt } from './token.utils';

interface Props {}

const Utloggingsvarsel: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('utloggingsvarsel');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const toggleModal = () => setModalOpen((prevState) => !prevState);

    useEffect(() => {
        const token = getSelvbetjeningIdtoken();
        const timeout = (time: number) =>
            setTimeout(() => {
                console.log('time out...');
            }, time);
        if (token) {
            try {
                const jwt = parseJwt(token);
                const timestamp = jwt['exp'];
                const currentTimestamp = new Date().getTime() / 1000;

                console.log(jwt);
                console.log('exp', timestamp);

                const date = new Date(timestamp * 1000);
                console.log('date: ', date);
                const formattedTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

                console.log(formattedTime, '|||', currentTimestamp);
                console.log('sum: ', timestamp - currentTimestamp);
            } catch (e) {
                console.log(e);
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
