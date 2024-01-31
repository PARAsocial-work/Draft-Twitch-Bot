//Importing

	//Authoriser and Easy Bot Twurple Imports for oAuth tokens and basic chatbot functionality 
	import { RefreshingAuthProvider } from '@twurple/auth';
	import { Bot, createBotCommand } from '@twurple/easy-bot';
	import { WhisperEvent } from '@twurple/easy-bot';
	import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
	import { ChatClient, ChatUser } from '@twurple/chat';

	//Needed FS to effectively fetch pronouns
	import { promises as fs } from 'fs';
	const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

	//Crypto (*booo*) for hashing (*yaaay*) 

	//Express for http requests
	import express from "express";
	import { Server } from 'socket.io';
	import { createServer } from 'node:http';
	import { fileURLToPath } from 'node:url';
	import { dirname, join } from 'node:path';
	import { generateIndexes } from './src/hash.js';

//
//
//
//Opening App + Socket to pass information to the browser page 
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const app = express();
	const server = createServer(app);
	const io = new Server(server);

	app.get('/', (req, res) => {
		res.sendFile(join(__dirname, '/client/browser.html'));
	});

	server.listen(3000, () =>
		console.log("We're golden")
	);

//
//
//
//Connecting Bot

	//Authorisation Token + Refresher
	const clientId = 'nicetry000000';
	const clientSecret = 'nicetry000000';
	const tokenData = JSON.parse(await fs.readFile('./tokens.xyz.json', 'UTF-8'));
	const authProvider = new RefreshingAuthProvider(
		{
			clientId,
			clientSecret
		}
	);
	authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.nicetry.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));
	await authProvider.addUserForToken(tokenData, ['chat']);

	//Connecting to Chat
	const chatClient = new ChatClient({ authProvider, channels: ['parasocial_work'] });

//
//
//
//Automated Message Explaining Bot Functionality 

	//Announces on entry
	chatClient.onConnect(() => {
		chatClient.say("parasocial_work", ("If you want to message (quasi-)anonymously, whisper me: the PSW_anons bot. Please check the 'Anon Messages' section below for details."));
		//Then announces every 20 minutes while connected
		const twentymins = (20*(60 * 1000));
		setInterval(function() {
    		chatClient.say("parasocial_work", ("If you want to message (quasi-)anonymously, whisper me: the PSW_anons bot. Please check the 'Anon Messages' section below for details."));
		}, twentymins);
		//Browser Socket Connection Confirmation 
		io.emit("conn", "Connected");
			//Refreshes connection indicator every 5 mins
			setInterval(function() {
				console.log(`We're STILL golden`);
				io.emit("conn", "Connected");
			}, 100000)
	});

//
//
//
//Pronouns + Reading Chat
//(Note - I checked with Alejo via his discord and confirmed consent to do this, and he requested pronouns are saved for ~5 minute period to minimize requests)

	//Possible Pronouns
	const pronounlist = [{"name":"aeaer","display":"Ae/Aer"},{"name":"any","display":"Any"},{"name":"eem","display":"E/Em"},{"name":"faefaer","display":"Fae/Faer"},{"name":"hehim","display":"He/Him"},{"name":"heshe","display":"He/She"},{"name":"hethem","display":"He/They"},{"name":"itits","display":"It/Its"},{"name":"other","display":"Other"},{"name":"perper","display":"Per/Per"},{"name":"sheher","display":"She/Her"},{"name":"shethem","display":"She/They"},{"name":"theythem","display":"They/Them"},{"name":"vever","display":"Ve/Ver"},{"name":"xexem","display":"Xe/Xem"},{"name":"ziehir","display":"Zie/Hir"}];

	//Storing Pronouns for 5 mins before removing them
	const savedUserPronouns = new Map();

	//Listening for messages in chat
	chatClient.onMessage((channel, user, message) => {
		const x = user;
		//Check if we've previously saved their pronouns locally
		if (savedUserPronouns.has(x)) {
			var userpronouns = savedUserPronouns.get(x).display;	
			
			//Actually sending the chat message into the Browser Source window
           		var finalmessage = [[user], [userpronouns], [message]];
			io.emit("chatter", finalmessage);
			
			return
			
		} else {
		//Doing a pronoun check to add pronouns to the message 
		fetch("https://pronouns.alejo.io/api/users/" + user)
			.then(response => response.json())
			.then(json => {
				// If pronouns assigned
				if (JSON.parse(JSON.stringify(json))[0] != undefined){
					const pronounraw = JSON.parse(JSON.stringify(json))[0].pronoun_id;
					for (let i = 0; i < pronounlist.length; i++){
                        		//If they've assigned pronouns, store them locally for a while to reduce traffic to alejo's website
						if (pronounlist[i].name === pronounraw){
							var userpronouns = pronounlist[i].display;
							savedUserPronouns.set(x, {"pronouns":pronounraw,"display":pronounList[i].display});
			                        	//Expiring local storage of their pronoun after 5 minutes
			                        	setTimeout(() => {
								savedUserPronouns.delete(x)
							}, 300000);
						}
					}
				} 
				// If no pronouns assigned
				else {
				// If the pronouns aren't set, set them as "Nil" (won't show up) for the next 2.5 minutes
					savedUserPronouns.set(x, {"pronouns":"Nil","display":"Nil"});
		                	setTimeout(() => {
		                        	savedUserPronouns.delete(x);
		                    	}, 150000);
				}
				
				//Actually sending the chat message into the Browser Source window
				var finalmessage = [[user], [userpronouns], [message]];
				io.emit("chatter", finalmessage);
			});	
		}
	});

//
//
//
// Muting Anons
// thought it'd be prudent to give mods the power to mute an anon
	
	const mutedanons = [];
	const modsList = ["parasocial_work", "mod1", "mod2", "mod3"]; //Turns out Twitch expects broadcaster perms to ask for a modlist? smh
	
	const bot = new Bot({ authProvider, channels: ["parasocial_work"], commands: [
		// !muteanon Command
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
		}),
	]});

//
//
//
//Checking If Caught In Automod Function
	//PLACEHOLDER 

//
//
//
//Handling Whispers
	//Holder for anons that have chatted already (will make sense below)
	const tonightsanons = new Map();

	//Holder for anons that trigger a spam warning
	const spamwarning = new Map();

		//Function to check how many times they've spammed
		function getByValue(map, searchValue) {
			for (let [key, value] of map.entries()) {
				if (key === searchValue)
				return value;
			}
		}

	//Function for Messy Scramble of Usernames
	function messy(x,y){
		
		//
		//Adding salt - placeholder only
		var x = (x + "35937289");
		const { a, b, c } = generateIndexes(x)
		//
		//Using a b and c to create the beginning, middle and end of an anon username ("userx")
		const randomstart = [...Array(26).keys()].map(i => String.fromCharCode(i + 0x41) + '-');
		var randommiddle = ["Grain", "Mail", "Blank", "Staff", "Chess", "Lute", "Draw", "Kola", "Ace", "Mana", "Neon", "River", "Tundra", "Dash", "Bronze", "Wood", "Zebra", "Teal", "Grape", "Film", "Honey", "Light", "Roll", "Gale", "Jade", "Beach", "Abode", "Gecko", "Wind", "Nano", "Orange", "Easel", "Yellow", "Foam", "Cabin", "Idea", "Deer", "Paint", "Tale", "Druid", "One", "Music", "Apple", "Rally", "Expo", "Swim", "Grey", "Lane", "Study", "Vase", "Delta", "Busk", "Here", "Cloud", "Sheer", "Kiwi", "Orange", "Toast", "Spirit", "Notes", "Cocoa", "Leaf", "Cloud", "Petal", "Frost", "Cotton", "Quip", "Coral", "Inn", "Piano", "Wand", "Kite", "Trunk", "Reef", "Colour", "Purple", "Lion", "Sand", "Pear", "Hour", "Tau", "Link", "Mast", "Green", "Hazel", "Satin", "Kiln", "Dew", "Gold", "Month", "East", "Palm", "Felt", "Jazz", "Read", "Moss", "Hive", "Lake", "Jam", "Cast", "Viola", "Tune", "Crow", "Clay", "Grey", "Berry", "Mist", "Aloe", "Gel", "Noon", "Scout", "Ring", "Fall", "Autumn", "Iced", "Harp", "Etch", "Blue", "North", "Jam", "Year", "Chip", "Spin", "Rain", "Park", "Uses", "Heat", "Font", "Silver", "Dive", "Book", "Aura", "Snow", "Parka", "Villa", "Open", "Nemo", "Indie", "Opal", "Air", "Red", "Shore", "Ink", "Nest", "Crow", "Oasis", "Art", "Home", "Coat", "Peak", "West", "East", "Vine", "South", "Olive", "June", "Yarn", "Shire", "Tale", "Hold", "Skies", "Cats", "Dogs", "Mage", "Card", "White", "Right", "Found", "Iris", "Bass", "Monday", "Centre"];
		const userx = (randomstart[a] + randommiddle[b] + c);
		
		//Function to remove the word used at b from future anon name options
		function removeUsernameOption(){
			var option = randommiddle.indexOf(randommiddle[b]);
			if (option !== -1) {
				randommiddle.splice(option, 1);
			}
		}	
		//Before putting anon message into chat, it checks if anon has been muted
		if (mutedanons.includes(userx)){
			return;
		}
		//First time an anon messages for the night, it adds the user to tonight's anon list
		if (tonightsanons.has(x) != true){
			chatClient.say("parasocial_work", ("A new anon started chatting"));
			tonightsanons.set(x, userx);
			removeUsernameOption();
            		var finalmessage = [["SYSTEM"], ["A new anon has started chatting"]];
			io.emit("anons", finalmessage);
		} 
		
		//Checking size of message and, if over 240 characters,  breaking it down into multiple messages of 200 chars each and sending to the chat 
        	if (String(userx + ": " + y).length > 240) {
			
            		var brokenmessage = y.match(/.{1,200}(?:\s|$)/g);

			//Adding spam warning for messages over 800 chars long 
			if (brokenmessage.length > 4) {
				
				//Giving users 3 chances with spam - 
				if (getByValue(spamwarning, x) === undefined) {
					spamwarning.set(x, {val: 1});
					var warningno = "1 of 3.";
				} else if (getByValue(spamwarning, x).val === 1) {
					spamwarning.get(x).val++;
					var warningno = "2 of 3.";
				} else if (getByValue(spamwarning, x).val === 2) {
					spamwarning.get(x).val++;
					var warningno = "3 of 3.";
				} else if (getByValue(spamwarning, x).val === 3) {
					mutedanons.push(String(userx));
					chatClient.say("parasocial_work", (String(userx) + " has been muted from anon posting for the day"));
					var finalmessage = [["SYSTEM"], [String(userx) + " has been muted from anon posting for the day"]];
					io.emit("anons", finalmessage);
					return;
				}
				
				chatClient.say("parasocial_work", ("Anon, the msg recieved was over 800 characters - please don't spam the chat. Spam warning " + warningno));
				var finalmessage = [["SYSTEM"], ["Anon, the msg recieved was over 800 characters - please don't spam the chat. Spam warning " + warningno]];
				io.emit("anons", finalmessage);
				return;
				
			} else {

				chatClient.onMessageFailed((channel, reason) =>{
					chatClient.say("parasocial_work", ("Message Error"));
				})
				
				//If not spam, iterating through the message's parts and sending them to the chat  
				for (let i = 0; i < brokenmessage.length; i++){
					const partno = i + 1;
					const totalno = brokenmessage.length;
					let message = (userx + " - "  + "(msg " + partno + " of " + totalno + "): " + brokenmessage[i]);
					//PLACEHOLDER - currently debugging - console.log(checkautomod(message));
					chatClient.say("parasocial_work", message);
					var finalmessage = [[userx], ["(msg " + partno + " of " + totalno + "): " + brokenmessage[i]]];
					io.emit("anons", finalmessage);
				};
			}
			
        	} else {
			//It's just a short message, send it
			let message = (userx + ": " + y);
			//PLACEHOLDER - currently debugging - console.log(checkautomod(message));
            		chatClient.say("parasocial_work", message);
			var finalmessage = [[userx], [y]];
			io.emit("anons", finalmessage);
        	}
	};

	
	//
	//What to do on Whisper
	chatClient.onWhisper((user, text, message) => {
		messy(user,text);
	});

	//
	//Connecting for Whispers
	chatClient.connect();
