import React from 'react';
import { AppState } from '../../../../reducer/reducer';
import { connect } from 'react-redux';
import BEMHelper from '../../../../utils/bem';
import { Status } from '../../../../api/api';
import { MenuValue, selectMenu } from '../../../../utils/meny-storage-utils';
import { dataInitState, Meny, MenyPunkter } from '../../../../reducer/menu-duck';
import { Language } from '../../../../reducer/language-duck';
import Menyknapp from './meny-knapp/Menyknapp';
import MenyBakgrunn from './meny-bakgrunn/MenyBakgrunn';
import DesktopVisningsmeny from './desktop-visningsmeny/DesktopVisningsmeny';
import { GACategory, triggerGaEvent } from '../../../../utils/google-analytics';

interface StateProps {
    meny: MenyPunkter;
    language: Language;
    arbeidsflate: MenuValue;
}

interface State {
    clicked: boolean;
    minside: Meny;
}

class Ekspanderbarmeny extends React.Component<StateProps, State> {
    static minside<T, K extends keyof T>(meny: T, key: K): T[K] {
        return meny[key];
    }

    constructor(props: StateProps) {
        super(props);
        this.state = {
            clicked: false,
            minside: dataInitState,
        };
        this.menutoggle = this.menutoggle.bind(this);
    }

    menutoggle = () => {
        const clicked = this.state.clicked;
        triggerGaEvent({
            category: GACategory.Header,
            action: `meny-${clicked ? 'close' : 'open'}`
        });
        this.setState({
            clicked: !clicked,
        });
    };

    render() {
        const {meny, language, arbeidsflate} = this.props;
        const {clicked} = this.state;
        const className = 'meny';
        const cls = BEMHelper(className);

        return (
            <>
                <Menyknapp
                    ToggleMenu={this.menutoggle}
                    clicked={this.state.clicked}
                    lang={language}
                    isMobile={false}
                />
                <div id="dropdown-menu" className={cls.element('meny-wrapper')}>
                    {meny.status === Status.OK ? (
                        <>
                            <div
                                className={cls.element(
                                    'meny-innhold-wrapper',
                                    this.state.clicked ? 'aktive' : '',
                                )}
                            >
                                <div className={cls.element('meny-innhold')}>
                                    <div className="media-lg-desktop media-mobil-tablet menyvisning-desktop">
                                        <DesktopVisningsmeny
                                            classname={className}
                                            isOpen={clicked}
                                            fellesmeny={selectMenu(
                                                meny.data,
                                                language,
                                                arbeidsflate,
                                            )}
                                            minsideMeny={Ekspanderbarmeny.minside(
                                                meny.data[0].children,
                                                3,
                                            )}
                                            arbeidsflate={arbeidsflate}
                                            lang={language}
                                        />
                                    </div>
                                </div>
                            </div>
                            <MenyBakgrunn
                                toggleWindow={this.menutoggle}
                                backgroundIsActive={this.state.clicked}
                                className={className}
                            />
                        </>
                    ) : null}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    meny: state.menypunkt,
    language: state.language.language,
    arbeidsflate: state.arbeidsflate.status,
});

export default connect(mapStateToProps)(Ekspanderbarmeny);
