//Imports 
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';

//
//Authorisation Token + Refresher
const clientId = '111111111';
const clientSecret = '111111111';
const tokenData = JSON.parse(await fs.readFile('./tokens.nicetryB.example.json', 'UTF-8'));
export const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret
	}
);

authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.xyzB.example.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));
await authProvider.addUserForToken(tokenData, ['chat']);

//
//Connecting to Chat
export const chatClientB = new ChatClient({ authProvider, channels: ['parasocial_work'] });

//
//Disconnect Bot
export function disconnectChatClient2(){
	chatClientB.quit();
}
