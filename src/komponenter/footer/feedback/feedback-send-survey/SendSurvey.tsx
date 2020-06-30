import React, { useState, Fragment, useEffect } from 'react';

import { Input } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';

import './SendSurvey.less';
import Tekst from 'tekster/finn-tekst';
import { Normaltekst } from 'nav-frontend-typografi';

const SendSurvey = () => {
    const [email, setEmail] = useState(String);
    const [emailValid, setEmailValid] = useState(true);
    const [inputErrorMessage, setInputErrorMessage] = useState('');

    const submitEmail = (evt: any) => {
        evt.preventDefault();

        console.log(`Email: ${email}`, validateEmailUsingRegEx(email));

        validateEmailUsingRegEx(email)
            ? sendSurveyToUser()
            : [
                  setEmailValid(false),
                  setInputErrorMessage('Epost er ikke gyldig'),
              ];
    };

    const validateEmailUsingRegEx = (email: string) => {
        const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(email);
    };

    const sendSurveyToUser = () => {
        setEmailValid(true);
        setInputErrorMessage('');

        console.log('Survey was sent to user');
    };

    return (
        <div className="send-survey-wrapper">
            <Normaltekst>
                <Tekst id="send-undersokelse-takk" />
            </Normaltekst>

            <Normaltekst>
                <Tekst id="send-undersokelse-sporsmaal" />
            </Normaltekst>

            <form onSubmit={submitEmail}>
                <Input
                    label="Din e-postaddresse"
                    onChange={(e) => setEmail(e.target.value)}
                    feil={inputErrorMessage}
                />

                <Hovedknapp inputMode="text" htmlType="submit">
                    <Tekst id="send-undersokelse-knapp" />
                </Hovedknapp>
            </form>
        </div>
    );
};

export default SendSurvey;
