//Imports 
import { chatClient } from './bot1con.js';
import { io, mutedanons, spamwarning } from '../index.js';

//Giving users 3 chances with spam - 
function getByValue(map, searchValue) {
	for (let [key, value] of map.entries()) {
		if (key === searchValue)
		return value;
	}
}

export function spamwarningfunc(userx){
    if (getByValue(spamwarning, userx) === undefined) {
        spamwarning.set(userx, { val: 1 });
        var warningno = "1 of 3.";
    } else if (getByValue(spamwarning, userx).val === 1) {
        spamwarning.get(userx).val++;
        var warningno = "2 of 3.";
    } else if (getByValue(spamwarning, userx).val === 2) {
        spamwarning.get(userx).val++;
        var warningno = "3 of 3.";
    } else if (getByValue(spamwarning, userx).val === 3) {
        mutedanons.push(String(userx));
        chatClient.say("parasocial_work", (String(userx) + " has been muted from anon posting for the day"));
        var finalmessage = [["SYSTEM"], [String(userx) + " has been muted from anon posting for the day"]];
        io.emit("anons", finalmessage);
        return warningno;
    }
    
	chatClient.say("parasocial_work", ("Anon, the msg recieved was over 800 characters - please don't spam the chat. Spam warning " + warningno));
	var finalmessage = [["SYSTEM"], ["Anon, the msg recieved was over 800 characters - please don't spam the chat. Spam warning " + warningno]];
	io.emit("anons", finalmessage);
	return;
}
