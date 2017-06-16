watchmen-plugin-discord-webhook
===

A plugin for [watchmen](https://github.com/iloire/watchmen) to execute webhooks on Discord.

Environment variables
---

Config is set through env variables (same as with watchmen itself).

```sh
export WATCHMEN_DISCORD_WEBHOOK_URL='<URL to your Discord webhook>'
```

Or, alternatively, you can also create a `config.js` file in the root folder of watchmen.

```javascript
module.exports = {
    WATCHMEN_DISCORD_WEBHOOK_URL: '<URL to your Discord webhook>',
};
```