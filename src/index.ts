/**
  * @module moodle-console
  * @category Category Name
  */

import EventEmitter from 'events';
import { Client, typings } from 'akora-moodle';

interface ConsoleClientEvents {
    message: [typings.Core.message.get_messages.message];
}

const textformat = {
    MOODLE: 0,
    HTML: 1,
    PLAIN: 2,
    MARKDOWN: 4
}

export class ConsoleClient extends EventEmitter {
    //@ts-ignore
    public userid: number;
    /** The cached chat history */
    //@ts-ignore
    public chat: typings.Core.message.get_messages.message[];
    /** The currently loggen in user */
    //@ts-ignore
    public user: typings.Core.webservice_get_site_info.response;
    /** The akora-moodle client */
    public client: Client;

    constructor(client: Client) {
        super();
        this.chat = [];
        this.client = client;
    }

    /**
     * This function initialises the Console by getting
     * informations about the currently logged in User and starts
     * checking for new messages, determined by the `timeout` option
     * or every 10 seconds by default.
     * 
     * **IMPORTANT**
     * 
     * The console doesn't work before this method is called, and 
     * calling it twice will break the console
     * 
     */
    public async initConsole(options: {
        /** Timeout in **ms** between every message check, by
         *   default this set to **10** `seconds`
        */
        timeout: number
    }) {
        const { timeout } = options ?? {};
        var info = await this.client.core.getInfo();
        this.userid = info.userid;
        this.user = info;

        setInterval(async () => {
            var response = await this.client.core.getMessages({
                useridfrom: this.userid + '',
                useridto: this.userid + '',
                limitnum: 2,
                newestfirst: 1
            });
            var { messages: arr } = response,
                before = this.chat.length;

            //Sorting out already chached messages 
            var arr = arr.filter(m => !this.chat.find(me => me.id === m.id));
            //Adding messages into cache
            this.chat.push(...arr);
            //Sorting cach again
            this.chat = this.chat.sort((a, b) => a.timecreated - b.timecreated);
            var mapped = this.chat.map(m => {
                return {
                    id: m.id,
                    text: m.smallmessage,
                    createdAt: m.timecreated,
                    readAt: m.timeread
                }
            })

            if (before < this.chat.length) {
                console.log('QwQ')
                console.log(mapped[this.chat.length - 1])
                //@ts-ignore
                this.emit('message', mapped[(this.chat.length) - 1]);
            }
        }, timeout ?? (1000 * 10))
    }

    async send(...messages: {
        /** The content of the message you send */
        text: string;
        /** Textformat of the message, as example if set
         * to `MARKDOWN` you can use markdown in your message,
         * this option is set to`MARKDOWN` by default
         */
        textformat?: keyof typeof textformat;
        /** IDK */
        clientmsgid?: string;
    }[]) {
        var arr = messages;
        for (const i in arr) {
            //@ts-ignore
            arr[i].touserid = this.userid;
            arr[i].textformat ??= 'MARKDOWN';
            let format = arr[i].textformat?.toUpperCase();
            //@ts-ignore
            if (Object.keys(textformat).includes(format)) format = textformat[format];
            else format = '4';
            //@ts-ignore
            arr[i].textformat = format;
        }

        return this.client.core.message.sendInstantMessages({
            //@ts-ignore
            messages: arr
        })
    }
}

export interface ConsoleClient extends EventEmitter {
    on<K extends keyof ConsoleClientEvents>(event: K, listener: (...args: ConsoleClientEvents[K]) => void): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof ConsoleClientEvents>,
        listener: (...args: any[]) => void,
    ): this;

    once<K extends keyof ConsoleClientEvents>(event: K, listener: (...args: ConsoleClientEvents[K]) => void): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof ConsoleClientEvents>,
        listener: (...args: any[]) => void,
    ): this;

    emit<K extends keyof ConsoleClientEvents>(event: K, ...args: ConsoleClientEvents[K]): boolean;
    emit<S extends string | symbol>(event: Exclude<S, keyof ConsoleClientEvents>, ...args: any[]): boolean;

    off<K extends keyof ConsoleClientEvents>(event: K, listener: (...args: ConsoleClientEvents[K]) => void): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof ConsoleClientEvents>,
        listener: (...args: any[]) => void,
    ): this;

    removeAllListeners<K extends keyof ConsoleClientEvents>(event?: K): this;
    removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof ConsoleClientEvents>): this;
}

export default Client;