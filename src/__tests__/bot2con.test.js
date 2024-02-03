//Imports
import { describe, it } from 'node:test';
import { chatClientB, disconnectChatClient2 } from '../bot2con.js';

//Tests
describe("connects bot 2", () => {
    it("states bot 2 connected", () => {
        chatClientB.onConnect();
        return "bot 2 connected";
    })
})

describe("disconnects bot 2", () => {
    it("states bot 2 disconnected", () => {
        disconnectChatClient2();
        return "bot 2 disconnected";
    })
})
