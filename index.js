//Importing

	//Twurple
	import { Bot, createBotCommand } from '@twurple/easy-bot';

	//Express for http requests
	import express from "express";
	import { Server } from 'socket.io';
	import { createServer } from 'node:http';
	import { fileURLToPath } from 'node:url';
	import { dirname, join } from 'node:path';
	import { generateIndexes } from './src/hash.js';

//
//Data Containers
	export const tonightsanons = new Map();
	export const spamwarning = new Map();
	export const mutedanons = [];

//
//Opening App + Socket to pass information to the browser page 
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const app = express();
	const server = createServer(app);
	export const io = new Server(server);

	app.get('/', (req, res) => {
		res.sendFile(join(__dirname, '/client/browser.html'));
	});

	server.listen(3000, () =>
		console.log("We're golden")
	);

//
//
// Chat Activity 

	//On Connect - Bot 2 posts Auto Message
	chatClientB.onConnect(() => {
		autoMessage2("false");
	});
	
	//On Connect - Bot 1 posts Auto Message + enabling muteanon command
	chatClient.onConnect(() => {
		autoMessage1("false");
		var modsList = ["parasocial_work", "mod1", "mod2", "mod3"]
		new Bot({ authProvider, channels: ["parasocial_work"], commands: [
			createBotCommand("muteanon", (params, { userName, say }) => {
				console.log(params);
				if (modsList.includes(userName) === true){
					mutedanons.push(String(params));
					say(String(params) + " has been muted from anon posting for the day");
							var finalmessage = [["SYSTEM"], [String(userx) + " has been muted from anon posting for the day"]];
							io.emit("anons", finalmessage);
				} else {
					say ("Mod only command")
				}
			})
		]});
	});


	//Listening for messages in chat
	chatClient.onMessage((channel, user, message) => {
		readChat(user, message, "false");
	});
	
//
//What to do on Whisper
chatClient.onWhisper((user, text, message) => {
	messy(user,text);
});

//
//Open Connections
chatClient.connect();
chatClientB.connect();
