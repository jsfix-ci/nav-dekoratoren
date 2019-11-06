import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../reducer/reducer';
import KnappBase from 'nav-frontend-knapper';
import Environments, { erNavDekoratoren, verifyWindowObj } from '../../../../utils/environments';
import AlertStripe from 'nav-frontend-alertstriper';
import Lukknapp from 'nav-frontend-lukknapp';
import Tekst from '../../../../tekster/finn-tekst';

import './Logg-inn-knapp.less';

const { baseUrl, logoutUrl, loginUrl } = Environments();

const getPath = () => {
    if (verifyWindowObj()) {
        return window.location.pathname.split('/')[3] !== undefined
            ? '/person/nav-dekoratoren/' +
                  window.location.pathname.split('/')[3]
            : '/person/nav-dekoratoren/';
    }
    return '/person/nav-dekoratoren/';
};

const path = erNavDekoratoren() ? getPath() : '/person/dittnav';
const login = `${loginUrl}/login?redirect=${baseUrl}${path}`;

interface StateProps {
    erInnlogget: boolean;
}

interface State {
    informasjonboks: Object;
}

class LoggInnKnapp extends React.Component<StateProps, State> {
    constructor(props: StateProps) {
        super(props);
        this.state = {
            informasjonboks: <div />,
        };
    }

    lukkdialogBoks = () => {
        this.setState({
            informasjonboks: <div />,
        });
    };

    informasjon = () => {
        return (
            <div>
                <AlertStripe type={'advarsel'}>
                    I localhost fungerer ikke innloggingslinjen. Og har blitt
                    erstattet med mock-api{' '}
                    <Lukknapp onClick={this.lukkdialogBoks} />
                </AlertStripe>
            </div>
        );
    };

    handleButtonClick = () => {
        if (process.env.NODE_ENV === 'production') {
            return this.props.erInnlogget
                ? (window.location.href = logoutUrl)
                : (window.location.href = login);
        } else {
            this.setState({
                informasjonboks: this.informasjon,
            });
        }
    };

    render() {
        const { erInnlogget } = this.props;
        const knappetekst = erInnlogget ? 'logg-ut-knapp' : 'logg-inn-knapp';

        return (
            <div className="login-container">
                <KnappBase
                    className="login-knapp"
                    type="standard"
                    onClick={this.handleButtonClick}
                >
                    <Tekst id={knappetekst} />
                </KnappBase>
            </div>
        );
    }
}
const mapStateToProps = (state: AppState): StateProps => ({
    erInnlogget: state.innloggingsstatus.data.authenticated,
});

export default connect(mapStateToProps)(LoggInnKnapp);
