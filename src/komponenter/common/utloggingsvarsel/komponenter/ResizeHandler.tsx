import React, { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';
import { verifyWindowObj } from '../../../../utils/Environment';

export const BREAKPOINT = 768;

export enum WindowType {
    DESKTOP = 'DESKTOP',
    MOBILE = 'MOBILE',
}

interface Props {
    setWindowType: Dispatch<SetStateAction<WindowType>>;
    windowType: WindowType;
}

const ResizeHandler: FunctionComponent<Props> = (props) => {
    const { windowType, setWindowType } = props;
    useEffect(() => {
        const resize = () => {
            if (verifyWindowObj() && window.innerWidth > BREAKPOINT && windowType === WindowType.MOBILE) {
                setWindowType(WindowType.DESKTOP);
            } else if (verifyWindowObj() && window.innerWidth < BREAKPOINT && windowType === WindowType.DESKTOP) {
                setWindowType(WindowType.MOBILE);
            }
        };
        window.addEventListener('resize', () => resize());
        window.removeEventListener('resize', () => resize());
    }, [windowType, setWindowType]);

    return <div />;
};
export default ResizeHandler;
