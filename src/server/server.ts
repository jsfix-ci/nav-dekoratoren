import express, { NextFunction, Request, Response } from 'express';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';

import { createMiddleware } from '@promster/express';
import { getSummary, getContentType } from '@promster/express';
import { clientEnv, fiveMinutesInSeconds } from './utils';
import cookiesMiddleware from 'universal-cookie-express';
import { template } from './template';
import compression from 'compression';
import dotenv from 'dotenv';
import { getMenuHandler } from './api-handlers/menu';
import { getSokHandler } from './api-handlers/sok';
import { getDriftsmeldingerHandler } from './api-handlers/driftsmeldinger';
import { varselInnboksProxyHandler, varselInnboksProxyUrl } from './api-handlers/varsler';

require('console-stamp')(console, '[HH:MM:ss.l]');

const isProduction = process.env.NODE_ENV === 'production';

// Local environment - import .env
if (!isProduction || process.env.PROD_TEST) {
    dotenv.config();
}

// Config
const appBasePath = process.env.APP_BASE_PATH || ``;
const oldBasePath = '/common-html/v4/navno';
const buildPath = `${process.cwd()}/build`;

const app = express();
const PORT = 8088;

const whitelist = ['.nav.no', '.oera.no', '.nais.io', 'https://preview-sykdomifamilien.gtsb.io'];
const isAllowedDomain = (origin?: string) => origin && whitelist.some((domain) => origin.endsWith(domain));

// Middleware
app.disable('x-powered-by');
app.use(compression());
app.use(cookiesMiddleware());
app.use((req, res, next) => {
    const origin = req.get('origin');
    const isLocalhost = origin?.startsWith('http://localhost:');

    // Allowed origins // cors
    if (isAllowedDomain(origin) || isLocalhost) {
        res.header('Access-Control-Allow-Origin', req.get('origin'));
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        res.header('Access-Control-Allow-Credentials', 'true');

        const requestHeaders = req.header('Access-Control-Request-Headers');
        if (requestHeaders) {
            res.header('Access-Control-Allow-Headers', requestHeaders);
        }
    }

    // Cache control
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    next();
});

if (process.env.NODE_ENV === 'development') {
    console.log('Running in local environment: Setting up LiveReload');
    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(`${__dirname}/build`);

    // ping browser on Express boot, once browser has reconnected and handshaken
    liveReloadServer.server.once('connection', () => {
        setTimeout(() => {
            liveReloadServer.refresh('/');
        }, 100);
    });

    app.use(connectLivereload());
}

// Metrics
app.use(
    createMiddleware({
        app,
        options: {
            labels: ['app', 'namespace', 'cluster'],
            getLabelValues: (req: Request, res: Response) => ({
                app: process.env.NAIS_APP_NAME || 'nav-dekoratoren',
                namespace: process.env.NAIS_NAMESPACE || 'local',
                cluster: process.env.NAIS_CLUSTER_NAME || 'local',
            }),
        },
    })
);

// Express config
const pathsForTemplate = [`${appBasePath}`, `${appBasePath}/:locale(no|en|se)/*`, `${oldBasePath}`];

// HTML template
app.get(pathsForTemplate, (req, res, next) => {
    try {
        res.send(template(req));
    } catch (e) {
        next(e);
    }
});

// Client environment
app.get(`${appBasePath}/env`, (req, res, next) => {
    try {
        const cookies = (req as any).universalCookies.cookies;
        res.send(clientEnv({ req, cookies }));
    } catch (e) {
        next(e);
    }
});

// Api endpoints
app.get(`${appBasePath}/api/meny`, getMenuHandler);
app.get(`${appBasePath}/api/sok`, getSokHandler);
app.get(`${appBasePath}/api/driftsmeldinger`, getDriftsmeldingerHandler);
app.use(varselInnboksProxyUrl, varselInnboksProxyHandler);

// Nais endpoints
app.use(`${appBasePath}/metrics`, (req, res) => {
    req.statusCode = 200;
    res.setHeader('Content-Type', getContentType());
    getSummary().then((summary) => res.end(summary));
});

app.get(`${appBasePath}/isAlive`, (req, res) => res.sendStatus(200));
app.get(`${appBasePath}/isReady`, (req, res) => res.sendStatus(200));

// Static files
app.use(
    `${appBasePath}/`,
    express.static(buildPath, {
        setHeaders: (res: Response) => {
            if (isProduction) {
                // Override cache on static files
                res.header('Cache-Control', `max-age=${fiveMinutesInSeconds}`);
                res.header('Pragma', `max-age=${fiveMinutesInSeconds}`);
            }

            // Allow serving resources to sites using cross-origin isolation
            res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        },
    })
);

// Error handler middleware
app.use((e: Error, req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('origin');
    const host = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const url = origin || host;
    console.error(`${url}: ${e.message}`);
    console.error(e.stack);
    res.status(405);
    res.send({
        error: { status: 405, message: e.message },
    });
});

const server = app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));

const shutdown = () => {
    console.log('Retrived signal terminate , shutting down node service');

    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
