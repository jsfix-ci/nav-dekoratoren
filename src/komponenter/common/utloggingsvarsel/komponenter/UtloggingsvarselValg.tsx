import React, { FunctionComponent } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import BEMHelper from '../../../../utils/bem';
import { useSelector } from 'react-redux';
import { getLoginUrl } from '../../../../utils/login';
import { AppState } from '../../../../store/reducers';

interface Props {
    toggleModal: () => void;
}
const stateSelector = (state: AppState) => ({
    arbeidsflate: state.arbeidsflate.status,
    environment: state.environment,
});

const UtloggingsvarselValg: FunctionComponent<Props> = (props) => {
    const cls = BEMHelper('utloggingsvarsel');
    const { toggleModal } = props;
    const { arbeidsflate, environment } = useSelector(stateSelector);
    const loginUrl = getLoginUrl(environment, arbeidsflate);

    return (
        <div className={cls.element('valg')}>
            <Knapp type="hoved" onClick={toggleModal}>
                lukk vinduet og fortsett
            </Knapp>
            <Knapp
                type="hoved"
                onClick={() => {
                    window.location.href = loginUrl;
                }}
            >
                logg inn på nytt
            </Knapp>
        </div>
    );
};
export default UtloggingsvarselValg;
