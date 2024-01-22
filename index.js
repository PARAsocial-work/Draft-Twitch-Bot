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
//Handling Whispers
	//Holder for anons that have chatted already (will make sense below)
	var tonightsanons = [];

	//Function for Messy Scramble of Usernames
	function messy(x,y){
		
		//
		//Adding salt - placeholder only
		var x = (x + "35937289");
		
		//
		//Hash it - secret placeholder only
		var hashed = new Buffer(
				crypto.createHmac('SHA256', '123456').update(x).digest('hex')
			).toString('base64');
		
		//
		//Remove non-alphabet characters from the hash
		for (let i = 0; i < hashed.length; i++){
				if (!((hashed[i] >= 'A' && hashed[i] <= 'Z') || (hashed[i] >= 'a' && hashed[i] <= 'z') || (hashed[i] >= '0' && hashed[i] <= '9'))) {
					hashed = hashed.substring(0, i) + hashed.substring(i + 1);
					i--;}
		};
		
		//
		//Make hash into a BigInt by replacing letters with their numerical equiv 
		var lowercaseWord = hashed.toLowerCase();
		var getLetterValue = letter => {
			if (letter >= 'a' && letter <= 'z') {
				return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
			} else {
				return 0;
			}
		};		
		var values = Array.from(lowercaseWord, getLetterValue);
		var numbervalue = String(BigInt(String(values).replace(/,/g, '')));
		var stringnumbervaluelength = String(numbervalue).length;
		
		//
		//Using the hash to create some number values for vars a, b and c 
		var a = parseInt(numbervalue[24]) + parseInt(numbervalue[1]) + parseInt(numbervalue[75]);
		var b = (parseInt(numbervalue[2]) + parseInt(numbervalue[9]) + parseInt(numbervalue[16]) + parseInt(numbervalue[23]) + parseInt(numbervalue[38]) + parseInt(numbervalue[43]) + parseInt(numbervalue[59]) + parseInt(numbervalue[64]) + parseInt(numbervalue[71]) + parseInt(numbervalue[80]) + parseInt(numbervalue[87]));
		
		var totalfours = 0;
		for (let i = 0; i < parseInt(stringnumbervaluelength); i++) {
			if (numbervalue[i] === '4') {
				totalfours++;
			}
		};
		
		var c = totalfours;
		
		//
		//Using a b and c to create the beginning, middle and end of an anon username
		var randomstart = ["A-", "B-", "C-", "D-", "E-", "F-", "G-", "H-", "I-", "J-", "K-", "L-", "M-", "N-", "O-", "P-", "Q-", "R-", "S-", "T-", "U-", "V-", "W-", "X-", "Y-", "Y-", "Z-", "Z-"];

		var randommiddle = ["Ace", "Aloe", "Apple", "Aura", "Beach", "Berry", "Blank", "Blue", "Book", "Busk", "Chess", "Chip", "Clay", "Cloud", "Cocoa", "Coral", "Crow", "Dash", "Deer", "Dive", "Draw", "Easel", "East", "Etch", "Expo", "Felt", "Film", "Foam", "Font", "Gale", "Gecko", "Grain", "Grape", "Grey", "Harp", "Hazel", "Heat", "Hive", "Honey", "Hour", "Iced", "Idea", "Indie", "Jade", "Jam", "Jazz", "Kiln", "Kite", "Kiwi", "Kola", "Lane", "Leaf", "Light", "Link", "Lute", "Mail", "Mana", "Mast", "Moss", "Music", "Nano", "Nemo", "Neon", "Noon", "One", "Open", "Opal", "Orange", "Paint", "Palm", "Park", "Parka", "Petal", "Piano", "Purple", "Quay", "Quip", "Rain", "Read", "Reef", "Ring", "River", "Roll", "Sand", "Satin", "Scout", "Snow", "Spin", "Staff", "Study", "Swim", "Tale", "Toast", "Tundra", "Tune", "Uses", "Vase", "Villa", "Viola", "Wind", "Wood"];

		var randomend = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89"];

		var userx = (randomstart[a] + randommiddle[b] + randomend[c]);
		
		//Placeholder for echoing into my anon window
		console.log("ANON MSG: " + userx + " - " + y);
				
		//Before putting anon message into chat, it checks if anon has been muted
		if (mutedanons.includes(userx) === false){
			//First time an anon messages for the night, it adds the user to an array of tonight's anons
			if (tonightsanons.includes(userx) != true){
				chatClient.say("parasocial_work", ("A new anon started chatting"));
				chatClient.say("parasocial_work", (userx + " said: " + y));
				tonightsanons.push(userx);
			} else {
				chatClient.say("parasocial_work", (userx + " said: " + y));
			}
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

