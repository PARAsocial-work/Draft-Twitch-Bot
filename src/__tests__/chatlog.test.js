//Imports 
import { strict as assert } from 'assert';
import { describe, it } from 'node:test';
import { readChat } from '../chatlog.js';

//Tests
const user = "PARAsocial_work";
const message = "test message";
const test = "true";

describe("read chat", () => {
    it("reads chat", () => {
        readChat(user, message, test);
        return "reads chat";
    })
    it ("constructs final message", () => {
        readChat(user, message, test);
        if(readChat(user, message, test) === ([[user], ["He/They"], [message]])){
            return "constructed final message correctly";
        }
    })
})
