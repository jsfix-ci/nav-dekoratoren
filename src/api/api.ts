import { fetchToJson } from './api-utils';
import { Data as innloggingsstatusData } from '../store/reducers/innloggingsstatus-duck';
import { VarslerData as varselinnboksData } from '../store/reducers/varselinnboks-duck';
import { MenyNode as menypunkterData } from '../store/reducers/menu-duck';
import { DriftsmeldingerData } from 'store/reducers/driftsmeldinger-duck';
import { FeatureToggles } from 'store/reducers/feature-toggles-duck';
import { TilbakemeldingRespons } from '../store/reducers/tilbakemelding-duck';

export enum Status {
    OK = 'OK',
    FEILET = 'FEILET',
    PENDING = 'PENDING',
    IKKE_STARTET = 'IKKE_STARTET',
    RELOADING = 'RELOADING',
}

export interface DataElement {
    status: Status;
}

export const hentMenyPunkter = (APP_URL: string): Promise<menypunkterData[]> => fetchToJson(`${APP_URL}/api/meny`);

export const hentInnloggingsstatusFetch = (API_DEKORATOREN_URL: string): Promise<innloggingsstatusData> =>
    fetchToJson(`${API_DEKORATOREN_URL}/auth`, {
        credentials: 'include',
    });

export const hentVarslerFetch = (APP_URL: string): Promise<varselinnboksData> => {
    const tidspunkt = new Date().getTime();
    return fetchToJson(`${APP_URL}/api/varsler/rest/varsel/hentsiste?noCache=${tidspunkt}`, { credentials: 'include' });
};

export const lagreVarslerLestFetch = (APP_URL: string, nyesteId: number): Promise<number> =>
    fetchToJson(`${APP_URL}/api/varsler/rest/varsel/erlest/${nyesteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nyesteId),
        credentials: 'include',
    });

export const fetchFeatureToggles = (API_DEKORATOREN_URL: string, featureToggles: FeatureToggles) =>
    fetchToJson(`${API_DEKORATOREN_URL}/feature-toggles${getFeatureToggleUrl(featureToggles)}`, {
        credentials: 'include',
    });

export const getFeatureToggleUrl = (featureToggles: FeatureToggles) =>
    Object.keys(featureToggles)
        .map((feature: string, i: number) => `${!i ? `?` : ``}feature=${feature}`)
        .join('&');

export const hentDriftsmeldinger = (APP_URL: string): Promise<DriftsmeldingerData[]> =>
    fetchToJson(`${APP_URL}/api/driftsmeldinger`);

export const lagreTilbakemeldingFetch = (
    feedback: TilbakemeldingRespons,
    FEEDBACK_API_URL: string
): Promise<number> => {
    return fetchToJson(FEEDBACK_API_URL, {
        method: 'POST',
        body: JSON.stringify(feedback),
        credentials: 'include',
    });
};
