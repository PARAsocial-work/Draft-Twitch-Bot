//Imports 
import { chatClient } from './bot1con.js';
import { io } from '../index.js';

//
//Bot's Automated Messages
	export function autoMessage1(test){
		chatClient.say("parasocial_work", ("If you want to message (quasi-)anonymously, whisper me: the PSW_anons bot. Please check the 'Anon Messages' section below for details."));
		//Then announces every 20 minutes while connected
		if (test === "false"){
			const twentymins = (20 * (60 * 1000));
			setInterval(function () {
				chatClient.say("parasocial_work", ("If you want to message (quasi-)anonymously, whisper me: the PSW_anons bot. Please check the 'Anon Messages' section below for details."));
			}, twentymins);
			//Browser Socket Connection Confirmation 
			io.emit("conn", "Connected");
			//Refreshes connection indicator every 5 mins
			setInterval(function () {
				io.emit("conn", "Connected");
			}, 100000);
		} else if (test === "true"){
			chatClient.quit();
		}
	}
