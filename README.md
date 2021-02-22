[![NPM Version](https://img.shields.io/npm/v/moodle-console?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/moodle-console)
[![NPM Downloads](https://img.shields.io/npm/dt/moodle-console?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/moodle-console)
[![NPM License](https://img.shields.io/npm/l/moodle-console?color=00DEC8&style=for-the-badge)](https://www.npmjs.com/package/moodle-console)
[![Github Size](https://img.shields.io/github/repo-size/discord-card/levelcard?color=00DEC8&label=SIZE&style=for-the-badge)](https://www.npmjs.com/package/moodle-console)

# Moodle Client Console
This is a package provides you an event based Console in **Moodle** wich you can write and receive messages from. The Console is based on the `akora-moodle` package and has built-in typings, it is simple, fast and lightweight.

<br>

## How does it work?
This console works by sending messages to yourself on Moodle, the Client receives your new message and you can execute some code with the message.

<br>

## Why should i use this package?
Bcs implementing this on your own would take quite a while and it just would be faster to use this package.
You may ask, "What if i want to have a function that the package does not provide?", we would love to implement your hopefully usefull function and constantly improve our package, so feel free to [open a Issue or an Feature Request](https://github.com/AKORA-Studios/MoodleConsole/issues/new/choose!).

<br>

# Getting started
## Installation
```bash
npm install moodle-console
```

<br>

## Creating an instance
To create a instance of the `ConsoleClient`, first need a instance of a `Client` from the [akora-moodle](https://www.npmjs.com/package/akora-moodle) package, which you need provide in the constructor. More information on creating a `Client` can be found [here](https://www.npmjs.com/package/akora-moodle).

<details open><summary>The most basic setup would be</summary><p>

> ```js
> const { ConsoleClient } = require('moodle-console')
> const { Client } = require('akora-moodle');
> 
> Client.init({
>    wwwroot: 'https://moodle.your-school.de/',
>    token: 'yourtokengoesbrrrrrr'
> }).then(async client => {
>     var con = new ConsoleClient(client);
>     await con.initConsole();
> 
>     con.send({
>         text: 'Hello World'
>     })
> })
> ```
</p></details>
<br>

## Listening to messages
The `ConsoleClient` is a EventEmitter which means that you can listen to events with `.on('event', callback)`, currently only the `message` event is supported

<details open><summary>Ping Pong!</summary><p>

> ```js
> var con = new ConsoleClient(client);
> con.initConsole().then(async () => {
>     await con.send({
>         text: '**Started the Console!**'
>     })
>     
>     con.on('message', async (message) => {
>         await con.send({ text: 'Pong!' });
>     });
> })
> ```
</p></details>

This would write back Pong every time you send a message to yourself in moodle.