import http from 'node:http';
import { logAllEvents } from './utils.mjs';
import chalk from 'chalk';

// -----------------------------------------------------------------------------

const PORT = 3456;

// -----------------------------------------------------------------------------

const listener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Log all request events.
    logAllEvents(
        ['close', 'data', 'end', 'error', 'pause', 'readable', 'resume'],
        req,
        {
            prefixColor: chalk.yellow,
            prefix: `Request (${req.url})`,
        }
    );

    // Log all response events.
    logAllEvents(
        ['close', 'drain', 'error', 'finish', 'pipe', 'unpipe'],
        res,
        {
            prefixColor: chalk.greenBright,
            prefix: `Response (${req.url})`,
        }
    );

    // Write a blank line after request and response logs.
    console.log("");

    // Actual response behavior.
    processRequest(req, res);
};

const processRequest = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = new URL(req.url ?? '', `http://${req.headers.host}`);
    const path = url.pathname;
    
    if (path == '/longrequest') {
        let seconds = 5;

        try {
            seconds = parseInt(url.searchParams.get('seconds') ?? '5');
            if (seconds < 1) {
                console.error(`[/longrequest]\tValue for 'seconds' query parameter must be greater than 0: ${url.searchParams.get('seconds')}`)
                seconds = 1;
            } else if (seconds > 30) {
                console.error(`[/longrequest]\tValue for 'seconds' query parameter must be less than or equal to 30: ${url.searchParams.get('seconds')}`)
                seconds = 30;
            }
        } catch (_) {
            console.error(`[/longrequest]\tInvalid value for 'seconds' query parameter: ${url.searchParams.get('seconds')}`)
        };
        
        setTimeout(() => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello, world!\n');
        }, seconds * 1000);

        return;
    }

    if (path == '/longpoll') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Hello, world!\n');

        setTimeout(() => {
            res.end('Hello, world!\n');
        }, 5000);

        return;
    }

    if (path == '/bigfile') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        // 1GiB file = 1024^3 / 4096 = 262144 chunks
        const chunkCount = 262144;

        for (let i = 0; i < chunkCount; i++) {
            // 4KB chunks
            await new Promise<void>((resolve, reject) => {
                res.write('a'.repeat(4096), (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        // End with terminating newline.
        res.end('\n');

        return;
    }

    // Catch-all for all requests.
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!\n');
};

// -----------------------------------------------------------------------------

const server = http.createServer(listener);
server.listen(PORT, () => {
    console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
