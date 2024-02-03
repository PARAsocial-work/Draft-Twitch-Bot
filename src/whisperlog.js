//Imports 
import { generateIndexes } from './hash.js';
import { chatClient } from './bot1con.js';
import { autoModCheck, autoModCheckParts } from './bot2ops.js';
import { mutedanons, tonightsanons, io } from '../index.js';
import { spamwarningfunc } from './spamwarning.js';

//Scramble Usernames
export function messy(x, y) {

	//Adding salt - placeholder only
	const { a, b, c } = generateIndexes(x);
	//
	//Using a b and c to create the beginning, middle and end of an anon username ("userx")
	const randomstart = [...Array(26).keys()].map(i => String.fromCharCode(i + 65) + '-');
	var randommiddle = ["Grain", "Mail", "Blank", "Staff", "Chess", "Lute", "Draw", "Kola", "Ace", "Mana", "Neon", "River", "Tundra", "Dash", "Bronze", "Wood", "Zebra", "Teal", "Grape", "Film", "Honey", "Light", "Roll", "Gale", "Jade", "Beach", "Abode", "Gecko", "Wind", "Nano", "Orange", "Easel", "Yellow", "Foam", "Cabin", "Idea", "Deer", "Paint", "Tale", "Druid", "One", "Music", "Apple", "Rally", "Expo", "Swim", "Grey", "Lane", "Study", "Vase", "Delta", "Busk", "Here", "Cloud", "Sheer", "Kiwi", "Orange", "Toast", "Spirit", "Notes", "Cocoa", "Leaf", "Cloud", "Petal", "Frost", "Cotton", "Quip", "Coral", "Inn", "Piano", "Wand", "Kite", "Trunk", "Reef", "Colour", "Purple", "Lion", "Sand", "Pear", "Hour", "Tau", "Link", "Mast", "Green", "Hazel", "Satin", "Kiln", "Dew", "Gold", "Month", "East", "Palm", "Felt", "Jazz", "Read", "Moss", "Hive", "Lake", "Jam", "Cast", "Viola", "Tune", "Crow", "Clay", "Grey", "Berry", "Mist", "Aloe", "Gel", "Noon", "Scout", "Ring", "Fall", "Autumn", "Iced", "Harp", "Etch", "Blue", "North", "Jam", "Year", "Chip", "Spin", "Rain", "Park", "Uses", "Heat", "Font", "Silver", "Dive", "Book", "Aura", "Snow", "Parka", "Villa", "Open", "Nemo", "Indie", "Opal", "Air", "Red", "Shore", "Ink", "Nest", "Crow", "Oasis", "Art", "Home", "Coat", "Peak", "West", "East", "Vine", "South", "Olive", "June", "Yarn", "Shire", "Tale", "Hold", "Skies", "Cats", "Dogs", "Mage", "Card", "White", "Right", "Found", "Iris", "Bass", "Monday", "Centre"];
	const userx = (randomstart[a] + randommiddle[b] + c);

	//Function to remove the word used at b from future anon name options
	function removeUsernameOption() {
		var option = randommiddle.indexOf(randommiddle[b]);
		if (option !== -1) {
			randommiddle.splice(option, 1);
		}
	}

	//Before putting anon message into chat, it checks if anon has been muted
	if (mutedanons.includes(userx)) {
		return;
	}

	//First time an anon messages for the night, it adds the user to tonight's anon list
	if (tonightsanons.has(x) != true) {
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
			spamwarningfunc(userx);
		} else {
			chatClient.onMessageFailed((channel, reason) => {
				chatClient.say("parasocial_work", ("Message Error"));
			});
			var messagechat = ["", "", "", ""];
			//If not spam, iterating through the message's parts and sending them to the chat 
			for (let i = 0; i < brokenmessage.length; i++) {
				const partno = i + 1;
				const totalno = brokenmessage.length;
				messagechat[i] = userx + " - " + "(msg " + partno + " of " + totalno + "): " + brokenmessage[i];
			};
			autoModCheckParts(messagechat);
		}
	} else {
		//It's just a short message, send it
		let message = (userx + ": " + y);
		autoModCheck(message, userx, "");
		chatClient.say("parasocial_work", message);
	}
}
