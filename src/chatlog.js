//Imports 
import { io } from '../index.js';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//Possible Pronouns
var pronounList = [{ "name": "aeaer", "display": "Ae/Aer" }, { "name": "any", "display": "Any" }, { "name": "eem", "display": "E/Em" }, { "name": "faefaer", "display": "Fae/Faer" }, { "name": "hehim", "display": "He/Him" }, { "name": "heshe", "display": "He/She" }, { "name": "hethem", "display": "He/They" }, { "name": "itits", "display": "It/Its" }, { "name": "other", "display": "Other" }, { "name": "perper", "display": "Per/Per" }, { "name": "sheher", "display": "She/Her" }, { "name": "shethem", "display": "She/They" }, { "name": "theythem", "display": "They/Them" }, { "name": "vever", "display": "Ve/Ver" }, { "name": "xexem", "display": "Xe/Xem" }, { "name": "ziehir", "display": "Zie/Hir" }];

//Storing Pronouns for 5 mins before removing them
const savedUserPronouns = new Map();

export function readChat(user, message, test){

	const x = user;
	//Check if we've previously saved their pronouns locally
	if (savedUserPronouns.has(x)) {
		var userpronouns = savedUserPronouns.get(x).display;
		//Actually sending the chat message into the Browser Source window
		var finalmessage = [[user], [userpronouns], [message]];
		io.emit("chatter", finalmessage);
		return;
	} else {
		//Doing a pronoun check to add pronouns to the message 
		fetch("https://pronouns.alejo.io/api/users/" + user)
			.then(response => response.json())
			.then(json => {
				// If pronouns assigned
				if (JSON.parse(JSON.stringify(json))[0] != undefined) {
					const pronounraw = JSON.parse(JSON.stringify(json))[0].pronoun_id;
					for (let i = 0; i < pronounList.length; i++) {
						//If they've assigned pronouns, store them locally for a while to reduce traffic to alejo's website
						if (pronounList[i].name === pronounraw) {
							var userpronouns = pronounList[i].display;
							savedUserPronouns.set(x, { "pronouns": pronounraw, "display": pronounList[i].display });
							//Expiring local storage of their pronoun after 5 minutes
							if (test === "false"){
								setTimeout(() => {
									savedUserPronouns.delete(x);
								}, 300000);
							}
						}
					}
				}
				// If no pronouns assigned
				else {
					// If the pronouns aren't set, set them as "Nil" (won't show up) for the next 2.5 minutes
					savedUserPronouns.set(x, { "pronouns": "Nil", "display": "Nil" });
					if (test === "false"){
						setTimeout(() => {
							savedUserPronouns.delete(x);
						}, 150000);
					}
				}
				//Actually sending the chat message into the Browser Source window
				var finalmessage = [[user], [userpronouns], [message]];
				io.emit("chatter", finalmessage);
				return finalmessage;
			});
	}
}
