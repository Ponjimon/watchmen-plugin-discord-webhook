'use strict';

var rp = require('request-promise');
var moment = require('moment');
var config = {};

try {
    config = require(__dirname + '/../../../config.js');
    console.log('watchmen-plugin-discord-webhook will use config.js from root folder!');
} catch (e) {
    console.log('No config found, depending on env variables...');
}

const WEBHOOK_URL = process.env.WATCHMEN_DISCORD_WEBHOOK_URL || config.WATCHMEN_DISCORD_WEBHOOK_URL;

const onNewOutage = function (service, outage) {
    const options = {
        uri: WEBHOOK_URL + '/slack',
        method: 'POST',
        body: {
            text: '',
            attachments: [
                {
                    color: 'danger',
                    fields: [
                        {
                            title: "Service",
                            value: service.name,
                            short: true
                        },
                        {
                            title: "Status",
                            value: "Major Outage",
                            short: true
                        },
                    ],
                    pretext: "**Service check failed!**",
                    text: JSON.stringify(outage.error),
                }
            ]
        },
        json: true,
    };

    rp(options).catch(function (err) {
        console.log('[watchmen-plugin-discord-webhook] Somethng went wrong:', err);
    });
};

const onLatencyWarning = function (service, outage) {
    const options = {
        uri: WEBHOOK_URL + '/slack',
        method: 'POST',
        body: {
            text: '',
            attachments: [
                {
                    color: 'warning',
                    fields: [
                        {
                            title: "Service",
                            value: service.name,
                            short: true
                        },
                        {
                            title: 'Duration',
                            value: outage.elapsedTime + 'ms',
                        },
                    ],
                    pretext: '**Latency warning!**',
                }
            ]
        },
        json: true,
    };

    rp(options).catch(function (err) {
        console.log('[watchmen-plugin-discord-webhook] Somethng went wrong:', err);
    });
};

const onServiceBack = function (service, lastOutage) {
    const duration = moment.duration(+new Date() - lastOutage.timestamp, 'seconds');
    const options = {
        uri: WEBHOOK_URL + '/slack',
        method: 'POST',
        body: {
            text: '',
            attachments: [
                {
                    color: 'good',
                    fields: [
                        {
                            title: "Service",
                            value: service.name,
                            short: true
                        },
                        {
                            title: 'Downtime',
                            value: duration.humanize(),
                        },
                    ],
                    pretext: '**Service is back!**',
                }
            ]
        },
        json: true,
    };

    rp(options).catch(function (err) {
        console.log('[watchmen-plugin-discord-webhook] Somethng went wrong:', err);
    });
};

function DiscordWebhookPlugin(watchmen) {
    watchmen.on('new-outage', onNewOutage);
    watchmen.on('latency-warning', onLatencyWarning);
    watchmen.on('service-back', onServiceBack);
}

module.exports = DiscordWebhookPlugin;
