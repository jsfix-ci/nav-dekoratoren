import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Lenkepanel from 'nav-frontend-lenkepanel/lib';

import Tekst from 'tekster/finn-tekst';
import {
    ArbeidsflateLenke,
    arbeidsflateLenker,
} from 'komponenter/header/header-regular/common/arbeidsflate-lenker/arbeidsflate-lenker';
import { AppState } from 'store/reducers';
import { Language } from 'store/reducers/language-duck';
import {
    cookieOptions,
    settArbeidsflate,
} from 'store/reducers/arbeidsflate-duck';
import { GACategory, gaEvent } from 'utils/google-analytics';
import { MenuValue } from 'utils/meny-storage-utils';
import { erNavDekoratoren } from 'utils/Environment';

import './FooterArbeidsflatevalg.less';

const stateSelector = (state: AppState) => ({
    arbeidsflate: state.arbeidsflate.status,
    language: state.language.language,
});

const FooterArbeidsflatevalg = () => {
    const dispatch = useDispatch();
    const [, setCookie] = useCookies(['decorator-context']);
    const { arbeidsflate, language } = useSelector(stateSelector);
    const { XP_BASE_URL, COOKIES, PARAMS } = useSelector(
        (state: AppState) => state.environment
    );

    const getLenker = () => {
        switch (arbeidsflate) {
            case MenuValue.IKKEBESTEMT:
                return arbeidsflateLenker(XP_BASE_URL).filter(
                    (lenke) => lenke.key !== COOKIES.CONTEXT
                );
            default:
                return arbeidsflateLenker(XP_BASE_URL).filter(
                    (lenke) => lenke.key !== arbeidsflate
                );
        }
    };

    const [lenker, setLenker] = useState<ArbeidsflateLenke[]>(getLenker());
    useEffect(() => {
        setLenker(getLenker());
    }, [arbeidsflate]);

    const showContextMenu =
        PARAMS.LANGUAGE !== Language.IKKEBESTEMT
            ? PARAMS.LANGUAGE === Language.NORSK
            : COOKIES.LANGUAGE !== Language.IKKEBESTEMT
            ? COOKIES.LANGUAGE === Language.NORSK
            : PARAMS.LANGUAGE === Language.IKKEBESTEMT ||
              language === Language.NORSK;
    return (
        <>
            {showContextMenu ? (
                <div className="menylenker-seksjon arbeidsflate">
                    <div className="arbeidsflatevalg-innhold">
                        <ul
                            className="arbeidsflatevalg"
                            aria-label="Gå til innhold for privatperson, arbeidsgiver eller samarbeidspartner"
                        >
                            {lenker.map((lenke: ArbeidsflateLenke) => (
                                <li key={lenke.key}>
                                    <Lenkepanel
                                        href={lenke.url}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            gaEvent({
                                                context: arbeidsflate,
                                                category: GACategory.Header,
                                                action: 'arbeidsflate-valg',
                                            });
                                            setCookie(
                                                'decorator-context',
                                                lenke.key,
                                                cookieOptions
                                            );
                                            if (erNavDekoratoren()) {
                                                dispatch(
                                                    settArbeidsflate(lenke.key)
                                                );
                                            } else {
                                                window.location.href =
                                                    lenke.url;
                                            }
                                        }}
                                        onAuxClick={(event) =>
                                            event.button &&
                                            event.button === 1 &&
                                            gaEvent({
                                                context: arbeidsflate,
                                                category: GACategory.Header,
                                                action: 'arbeidsflate-valg',
                                            })
                                        }
                                        tittelProps="normaltekst"
                                        key={lenke.key}
                                        border
                                    >
                                        <div className="arbeidsflatevalg-tekst">
                                            <Undertittel>
                                                <Tekst
                                                    id={lenke.lenkeTekstId}
                                                />
                                            </Undertittel>
                                            <Tekst
                                                id={lenke.footerStikkordId}
                                            />
                                        </div>
                                    </Lenkepanel>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default FooterArbeidsflatevalg;
