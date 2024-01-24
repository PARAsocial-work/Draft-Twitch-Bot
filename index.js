//Importing

	//Authoriser and Easy Bot Twurple Imports for oAuth tokens and basic chatbot functionality 
	import { RefreshingAuthProvider } from '@twurple/auth';
	import { Bot, createBotCommand } from '@twurple/easy-bot';
	import { WhisperEvent } from '@twurple/easy-bot';
	import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
	import { ChatClient, ChatUser } from '@twurple/chat';

	//Needed FS to effectively fetch pronouns
	import { promises as fs } from 'fs';
	var fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

	//Crypto (*booo*) for hashing (*yaaay*) 
	import * as crypto from "crypto";

//
//
//
//Connecting Bot

	//Authorisation Token + Refresher
	var clientId = 'nicetry000000';
	var clientSecret = 'nicetry000000';
	var tokenData = JSON.parse(await fs.readFile('./tokens.xyz.json', 'UTF-8'));
	var authProvider = new RefreshingAuthProvider(
		{
			clientId,
			clientSecret
		}
	);
	authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./tokens.nicetry.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));
	await authProvider.addUserForToken(tokenData, ['chat']);

	//Connecting to Chat
	var chatClient = new ChatClient({ authProvider, channels: ['parasocial_work'] });


//
//
//
//Reading Chat

	//Possible Pronouns
	var pronounlist = [{"name":"aeaer","display":"Ae/Aer"},{"name":"any","display":"Any"},{"name":"eem","display":"E/Em"},{"name":"faefaer","display":"Fae/Faer"},{"name":"hehim","display":"He/Him"},{"name":"heshe","display":"He/She"},{"name":"hethem","display":"He/They"},{"name":"itits","display":"It/Its"},{"name":"other","display":"Other"},{"name":"perper","display":"Per/Per"},{"name":"sheher","display":"She/Her"},{"name":"shethem","display":"She/They"},{"name":"theythem","display":"They/Them"},{"name":"vever","display":"Ve/Ver"},{"name":"xexem","display":"Xe/Xem"},{"name":"ziehir","display":"Zie/Hir"}];


	//Listening for messages in chat
	chatClient.onMessage((channel, user, message) => {

		//Doing a pronoun check to add pronouns to the message (Note - I checked with Alejo via his discord and confirmed consent to do this)	
		fetch("https://pronouns.alejo.io/api/users/" + user)
			.then(response => response.json())
			.then(json => {
				// If pronouns assigned
				if (JSON.parse(JSON.stringify(json))[0] != undefined){
					var pronounraw = JSON.parse(JSON.stringify(json))[0].pronoun_id;
						for (var i = 0; i < pronounlist.length; i++){
							if (pronounlist[i].name === pronounraw){
								var userpronouns = pronounlist[i].display;
							}
						}
					//Placeholder for echoing into my chat window
					console.log(`${user} (${userpronouns}) : ${message}`);
				} 
				// If no pronouns assigned
				else {
					//Placeholder for echoing into my chat window
					console.log(`${user} : ${message}`);
				};
			});	
	});

//
//
// Muting Anons
// thought it'd be prudent to give mods the power to mute an anon
	
	var mutedanons = [];
	var modsList = ["parasocial_work", "mod1", "mod2", "mod3"]; //Turns out Twitch expects broadcaster perms to ask for a modlist? smh
	
	const bot = new Bot({ authProvider, channels: ["parasocial_work"], commands: [
		// !muteanon Command
		createBotCommand("muteanon", (params, { userName, say }) => {
			console.log(params);

			if (modsList.includes(userName) === true){
				mutedanons.push(String(params));
				say(String(params) + " has been muted from anon posting for the day");
			} else {
				say ("Mod only command")
			}
		}),
	]});
//
//
//
// Scrambling nicknames
function scramble(username) {
    // salt. could be a pepper -- just move somewhere outside
	const salt = Array.from({length: 64}, () => {
		// 37 == twitch usernames can have lowercase a-z, 0-9 and _
		// making value 0 into '_' is just easier
		let i = Math.floor(Math.random() * 37);
		if (!i) return '_';
		i -= 1;
		if (i < 10) return String.fromCharCode(i + 0x30); // 0x30 == char '0'
		i -= 10;
		return String.fromCharCode(i + 0x61); // 0x61 == char 'a'
	}).join('');

	const salted = salt.slice(0, salt.length - username.length) + username
    // hashing with djb2
	// NOTE: this impl is not compatible with ones done in other languages due to how JS handles numbers
    const hash_raw = salted.split('').map((s) => {
        return s.charCodeAt(0);
    }).reduce((e, a) => {
        return (e << 5) + e + a;
    }, 5381);
    // making it 32 bits and preventing neg sign
    let hash = hash_raw & 0xffffffff + 0x80000000;
    console.log(hash.toString(16).padStart(8, '0'));

    // generating anon name
    const letter = String.fromCharCode(hash % 26 + 65); // 65 == 'A'
    hash = Math.floor(hash / 26);
	// TODO: maybe load word list from config at init stage?
    const words = ["Ace", "Aloe", "Apple", "Aura", "Beach", "Berry", "Blank", "Blue", "Book", "Busk", "Chess", "Chip", "Clay", "Cloud", "Cocoa", "Coral", "Crow", "Dash", "Deer", "Dive", "Draw", "Easel", "East", "Etch", "Expo", "Felt", "Film", "Foam", "Font", "Gale", "Gecko", "Grain", "Grape", "Grey", "Harp", "Hazel", "Heat", "Hive", "Honey", "Hour", "Iced", "Idea", "Indie", "Jade", "Jam", "Jazz", "Kiln", "Kite", "Kiwi", "Kola", "Lane", "Leaf", "Light", "Link", "Lute", "Mail", "Mana", "Mast", "Moss", "Music", "Nano", "Nemo", "Neon", "Noon", "One", "Open", "Opal", "Orange", "Paint", "Palm", "Park", "Parka", "Petal", "Piano", "Purple", "Quay", "Quip", "Rain", "Read", "Reef", "Ring", "River", "Roll", "Sand", "Satin", "Scout", "Snow", "Spin", "Staff", "Study", "Swim", "Tale", "Toast", "Tundra", "Tune", "Uses", "Vase", "Villa", "Viola", "Wind", "Wood"];
    const word = words[hash % words.length];
    hash = Math.floor(hash / words.length);
    const num = (hash % 100).toString();
    // hash = Math.floor(hash / 100);
    return letter + "-" + word + num
}
//
//
//
//Handling Whispers
	//Holder for anons that have chatted already (will make sense below)
	var tonightsanons = [];	
	//
	//What to do on Whisper
	chatClient.onWhisper((user, text, message) => {
		let userx = scramble(user)
		
		//Placeholder for echoing into my anon window
		console.log("ANON MSG: " + userx + " - " + text);
				
		//Before putting anon message into chat, it checks if anon has been muted
		if (mutedanons.includes(userx) === false){
			//First time an anon messages for the night, it adds the user to an array of tonight's anons
			if (tonightsanons.includes(userx) != true){
				chatClient.say("parasocial_work", ("A new anon started chatting"));
				chatClient.say("parasocial_work", (userx + " said: " + text));
				tonightsanons.push(userx);
			} else {
				chatClient.say("parasocial_work", (userx + " said: " + text));
			}
		}
	});


	//
	//Connecting for Whispers
	chatClient.connect();

