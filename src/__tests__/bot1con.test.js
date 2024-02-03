//Imports
import { describe, it } from 'node:test'
import { chatClient, disconnectChatClient } from '../bot1con.js'

//Tests
describe("connects bot 1", () => {
    it("states bot 1 connected", () => {
        chatClient.onConnect();
        return "bot 1 connected";
    })
})

describe("disconnects bot 1", () => {
    it("states bot 1 disconnected", () => {
        disconnectChatClient();
        return "bot 1 disconnected";
    })
})
