import chalk from "chalk";
import morgan from "morgan";
import fs from 'fs';
import path from "path";

// Get today's date in 'DD-MM-YYYY' format
const getTodayDate = () => new Date().toLocaleDateString('he-US', {
    year: 'numeric', month: '2-digit', day: '2-digit'
}).replace(/\./g, '-');

// Get current time in 'HH:MM:SS' format
const getTodayTime = () => new Date().toLocaleTimeString('he-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
});

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Create write stream for logs
const accessLogStream = fs.createWriteStream(path.join(logsDir, `${getTodayDate()}.txt`), { flags: 'a' });

// Console log format with colors
const consoleFormat = (tokens, req, res) => {
    const color = res.statusCode >= 400 ? chalk.red : chalk.green;
    return [
        chalk.cyan(getTodayDate()),
        chalk.cyan(getTodayTime()),
        color(tokens.method(req, res)),
        color(tokens.url(req, res)),
        color(tokens.status(req, res)),
        tokens['response-time'](req, res) + 'ms'
    ].join(' | ');
};

// File log format without colors
const fileFormat = (tokens, req, res) => [
    getTodayDate(),
    getTodayTime(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res) + 'ms'
].join(' | ');

// Console and file loggers
const consoleLogger = morgan(consoleFormat);
const fileLogger = morgan(fileFormat, { stream: accessLogStream });

// Middleware to log in both console and file
export const morganLogger = (req, res, next) => {
    consoleLogger(req, res, (err) => {
        if (err) return next(err);
        fileLogger(req, res, next);
    });
};
