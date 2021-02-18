import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';
import Minus from '../../../ikoner/varsler/Minus';
import Close from '../../../ikoner/varsler/Close';
import BEMHelper from '../../../utils/bem';
import { useSelector } from 'react-redux';
import { getLoginUrl } from '../../../utils/login';
import { AppState } from '../../../store/reducers';

interface Props {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}
const UtloggingNavigasjon: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('utloggingsvarsel');
    const { setModalOpen } = props;
    return (
        <nav className={cls.element('navigasjon')} aria-label="minimere og lukk varsel valg">
            <button className={cls.element('minimere')} aria-label="minimere modalen">
                <Minus width="24" height="20" />
            </button>
            <button className={cls.element('lukk')} onClick={() => setModalOpen(false)} aria-label="lukk modalen">
                <Close width="24" height="20" />
            </button>
        </nav>
    );
};
export default UtloggingNavigasjon;
