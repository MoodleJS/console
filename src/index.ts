/**
  * @module akora-moodle
  * @category Category Name
  */

import EventEmitter from 'events';
import { Client, typings } from 'akora-moodle';

interface ConsoleClientEvents {
    message: [typings.Core.message.get_messages.message];
}


export class ConsoleClient extends EventEmitter {
    //@ts-ignore
    public userid: number;
    //@ts-ignore
    public chat: typings.Core.message.get_messages.message[];
    //@ts-ignore
    public user: typings.Core.webservice_get_site_info.response;
    public client: Client;

    constructor(client: Client) {
        super();
        this.chat = [];
        this.client = client;
    }

    public async initConsole(options: {
        /** Timeout in ms between message checks */
        timeout: number
    }) {
        const { timeout } = options ?? {};
        var info = await this.client.core.getInfo();
        this.userid = info.userid;
        this.user = info;

        setInterval(async () => {

            var chat = await this.client.core.getMessages({
                useridfrom: this.userid + '',
                useridto: this.userid + '',
                limitnum: 2,
                newestfirst: 1
            });
            var { messages } = chat,
                len = this.chat.length;
            this.chat = this.chat.concat(this.chat, messages.filter(m => !this.chat.find(me => me.id === m.id)));
            this.chat = this.chat.sort((a, b) => a.timecreated - b.timecreated);

            if (len < this.chat.length)
                this.emit('message', this.chat[(this.chat.length) - 1]);
        }, timeout ?? (1000 * 10))
    }

    async send(...messages: {
        text: string;
        textformat: 0 | 1 | 2 | 4;
        clientmsgid?: string;
    }[]) {
        var arr = messages as typings.Core.message.send_instant_messages.message[];
        for (const i in arr)
            arr[i].touserid = this.userid;

        return this.client.core.message.sendInstantMessages({
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