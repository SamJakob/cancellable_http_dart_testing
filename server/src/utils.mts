import { EventEmitter } from 'node:events';
import chalk, { ChalkInstance } from 'chalk';

const defaultExtraOptions: ExtraOptions = {
    prefixColor: undefined,
    prefix: undefined,
};

type ExtraOptions = {
    prefixColor?: ChalkInstance;
    prefix?: string;
};

export function logAllEvents(
    events: string[],
    emitter: EventEmitter,
    options: ExtraOptions = defaultExtraOptions,
) {
    events.forEach(event => {
        emitter.on(event, (...args: any[]) =>
            logEvent(event, options, args)
        );
    });
}

export function logEvent(
    event: string,
    options: ExtraOptions = defaultExtraOptions,
    args: any[] = [],
) {
    const doPrefixColor = options.prefixColor ?? chalk.blueBright;

    const prefix = options.prefix ? doPrefixColor(`[${options.prefix}]`) : '';
    console.log(`${currentTimeWithMillis()}\t${prefix}\t${chalk.bold(event)}\t\t${args}`);
}

/** Prints the current timestamp with milliseconds (e.g., 9:55:21.01 AM) */
function currentTimeWithMillis() {
    const date = new Date();

    let hours: number | string = date.getHours();
    const ampm = hours < 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours > 0 ? hours : 12;
    hours = hours.toString().padStart(2, '0');

    let minutes: number | string = date.getMinutes();
    minutes = minutes.toString().padStart(2, '0');

    let seconds: number | string = date.getSeconds();
    seconds = seconds.toString().padStart(2, '0');
    
    const milliseconds = date.getMilliseconds();

    return `${hours}:${minutes}:${seconds}.${milliseconds} ${ampm}`;
}