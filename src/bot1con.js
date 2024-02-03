//Imports 
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';

//
//Authorisation Token + Refresher
const clientId = '00000000';
const clientSecret = '00000000';
const tokenData = JSON.parse(await fs.readFile('./tokens.nicetry.example.json', 'UTF-8'));
export const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret
	}
);

authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.xyz.example.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));
await authProvider.addUserForToken(tokenData, ['chat']);

//
//Connecting to Chat
export const chatClient = new ChatClient({ authProvider, channels: ['parasocial_work'] });

//
//Disconnect Bot
export function disconnectChatClient(){
	chatClient.quit();
}
