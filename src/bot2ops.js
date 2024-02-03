//Imports 
import { chatClient } from './bot1con.js';
import { chatClientB } from './bot2con.js';
import { io } from '../index.js';

//
//Bot's Automated Messages
export function autoMessage2(test){
	chatClientB.say("parasocial_work", ("Vacker Hoice: I'm in"));
	//Then announces every 20 minutes while connected
	if (test === "false"){
		const twentymins = (5 * (60 * 1000));
		setInterval(function () {
			chatClientB.say("parasocial_work", ("Vacker Hoice: I'm (still) in"));
		}, twentymins);
	} else if (test === "true"){
		chatClient.quit();
	}
}

//
// Automod Checking 
	//Small Messages
	export function autoModCheck(x, y, z){
		let messagesRecieved = [z];
		let userx = y;

		//Listening for messages in chat
		chatClientB.onMessage((channel, user, message) => {
			messagesRecieved.push(String(message));
		});

		setTimeout(() => {
			if (messagesRecieved.includes(x)){
				var finalmessage = [[userx], [y]];
				io.emit("anons", finalmessage);
				return false;
			} else if (!messagesRecieved.includes(x)){
				chatClient.say("parasocial_work", "Anon, it looks like your message was caught by automod. Please rephrase?");
				var finalmessage = ["SYSTEM", ["Message Error - Automod"]];
				io.emit("anons", finalmessage);
				return true;
			}
		}, "3000");
	}

	//Large Messages
	export function autoModCheckParts(messagesToBroadcast, z){
		//Listening for messages in chat
		let messagesRecieved = [z];
		chatClientB.onMessage((channel, user, message) => {
			messagesRecieved.push(String(message));
		});

		setTimeout(() => {
			chatClient.say("parasocial_work", messagesToBroadcast[0]);
			chatClient.say("parasocial_work", messagesToBroadcast[1]);
			chatClient.say("parasocial_work", messagesToBroadcast[2]);
			chatClient.say("parasocial_work", messagesToBroadcast[3]);
		}, 500);

		setTimeout(() => {
			const systemErrorMessage = ["SYSTEM", ["Message Error - Automod"]];
			console.log(messagesRecieved);
			console.log(String(messagesToBroadcast[0]));

			if (messagesRecieved.includes(messagesToBroadcast[0].trim()) === true) {
				io.emit("anons", ["anons", messagesToBroadcast[0]]);
			} else if (messagesRecieved.includes(messagesToBroadcast[0].trim()) != true) {
				chatClient.say("parasocial_work", "Anon, it looks like part of your message was caught by automod. Maybe rephrase?");
				io.emit("anons", systemErrorMessage);
				return true;
			}
			if (messagesRecieved.includes(messagesToBroadcast[1].trim())) {
				io.emit("anons", ["anons", messagesToBroadcast[1]]);
			} else if (!messagesRecieved.includes(messagesToBroadcast[1].trim())) {
				chatClient.say("parasocial_work", "Anon, it looks like part of your message was caught by automod. Maybe rephrase?");
				io.emit("anons", systemErrorMessage);
				return true;
			}
			if (messagesToBroadcast[2] === ""){
				return
			} else {
				if (messagesRecieved.includes(messagesToBroadcast[2].trim())) {
					io.emit("anons", ["anons", messagesToBroadcast[2]]);
					console.log("results for 3 is OK");
				} else if (!messagesRecieved.includes(messagesToBroadcast[2].trim())) {
					chatClient.say("parasocial_work", "Anon, it looks like part of your message was caught by automod. Maybe rephrase?");
					io.emit("anons", systemErrorMessage);
					console.log("results for 3 is Automod");
					return true;
				}
			}
			if (messagesToBroadcast[3] === ""){
				return
			} else {
				if (messagesRecieved.includes(messagesToBroadcast[3].trim())) {
					io.emit("anons", ["anons", messagesToBroadcast[3]]);
					console.log("results for 4 is OK");
				} else if (!messagesRecieved.includes(messagesToBroadcast[3].trim())) {
					chatClient.say("parasocial_work", "Anon, it looks like part of your message was caught by automod. Maybe rephrase?");
					io.emit("anons", systemErrorMessage);
					console.log("results for 4 is Automod");				
					return true;
				}
			}
			return false;
		}, 7500);
	}
