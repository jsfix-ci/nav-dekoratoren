import React, { Fragment, useState } from 'react';
import { Ingress } from 'nav-frontend-typografi';
import Tekst from 'tekster/finn-tekst';
import { Knapp } from 'nav-frontend-knapper';
import './Feedback.less';

import { verifyWindowObj } from 'utils/Environment';
import loadHotjarSurvey from 'utils/hotjar-surveys';
const { logAmplitudeEvent } = verifyWindowObj()
    ? require('utils/amplitude')
    : () => null;

const Feedback = () => {
    const [buttonsPressed, setButtonsPressed] = useState({
        yes: false,
        no: false,
    });

    const userPressedNo = () => {
        setButtonsPressed({ yes: false, no: true });
        loadHotjarSurvey('tps-test');
        logAmplitudeEvent('tilbakemelding', { svar: 'nei' });
    };

    const userPressedYes = () => {
        setButtonsPressed({ yes: true, no: false });
        logAmplitudeEvent('tilbakemelding', { svar: 'ja' });
    };

    return (
        <div className="feedback-container">
            {!buttonsPressed.yes && !buttonsPressed.no ? (
                <Fragment>
                    <Ingress>
                        <Tekst id="fant-du-det-du-lette-etter" />
                    </Ingress>
                    <div className="buttons-container">
                        <Knapp className="knapp" onClick={userPressedYes}>
                            Ja
                        </Knapp>
                        <Knapp className="knapp" onClick={userPressedNo}>
                            Nei
                        </Knapp>
                    </div>
                </Fragment>
            ) : null}

            {buttonsPressed.yes ? (
                <Ingress>
                    <Tekst id="send-undersokelse-takk" />
                </Ingress>
            ) : null}
            {buttonsPressed.no ? (
                <Ingress>
                    <Tekst id="send-undersokelse-takk" />
                </Ingress>
            ) : null}
        </div>
    );
};

export default Feedback;
