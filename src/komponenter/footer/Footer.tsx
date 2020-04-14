import React from 'react';
import { useSelector } from 'react-redux';

import SimpleFooter from './footer-simple/FooterSimple';
import RegularFooter from './footer-regular/FooterRegular';
import { AppState } from '../../reducer/reducers';

const Footer = () => {
    const { PARAMS } = useSelector((state: AppState) => state.environment);
    return (
        <footer className="sitefooter" role="contentinfo">
            {PARAMS.SIMPLE || PARAMS.SIMPLE_FOOTER ? (
                <SimpleFooter />
            ) : (
                <RegularFooter />
            )}
        </footer>
    );
};

export default Footer;
