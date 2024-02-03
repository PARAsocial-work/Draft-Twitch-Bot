//Imports 
import * as crypto from "crypto";

// Salting, Hashing, and Constructing Anonymized Usernames
export function generateIndexes(x) {

	//Scattered Salt
	var x = pocketSalt(x);

	//
	//Hash it - secret placeholder only
	var hashed = hash(x);

	//
	//Remove non-alphabet characters from the hash
	hashed = removeNonAlphabet(hashed);

	//
	//Make hash into a BigInt by replacing letters with their numerical equiv 
	const numbervalue = toNumberValue(hashed);
	const stringnumbervaluelength = String(numbervalue).length;

	//
	//Using the hash to create some number values for vars a, b and c 
	const { a, b } = parseCryptoIndex(numbervalue);
	const c = countFours(stringnumbervaluelength, numbervalue);

	return {a, b, c}
}

function pocketSalt(string) {
	const partOne = string.slice(0, string.length / 2)
	const partTwo = string.slice(string.length / 2, string.length)
	const saltPt1 = "0Q5A";
	const saltPt2 = "ANR";
	const saltPt3 = "7U1J";
	return (saltPt1 + partOne + saltPt2 + partTwo + saltPt3);
}

function hash(x) {
	return new Buffer(
		crypto.createHmac('SHA256', '123456').update(x).digest('hex')
	).toString('base64');
}

function removeNonAlphabet(hashed) {
	for (let i = 0; i < hashed.length; i++) {
		if (!((hashed[i] >= 'A' && hashed[i] <= 'Z') || (hashed[i] >= 'a' && hashed[i] <= 'z') || (hashed[i] >= '0' && hashed[i] <= '9'))) {
			hashed = hashed.substring(0, i) + hashed.substring(i + 1);
			i--;
		}
	};
	return hashed;
}
function isEven(n) {
	return n % 2 == 0;
 }
 
function toNumberValue(hashed) {
	const lowercaseWord = hashed.toLowerCase();
	const getLetterValue = letter => {
		if (letter >= 'a' && letter <= 'z') {
			return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
		} else {
			return 0;
		}
	};
	const values = Array.from(lowercaseWord, getLetterValue);
	const numbervalue = String(BigInt(String(values).replace(/,/g, '')));
	return numbervalue;
}

function parseCryptoIndex(numbervalue) {
	if (isEven(parseInt(numbervalue[14]))){
		var a = (parseInt(numbervalue[17]) + parseInt(numbervalue[61]) + parseInt(numbervalue[28]));
	} else {
		var a = (parseInt(numbervalue[23]) + parseInt(numbervalue[36]) + parseInt(numbervalue[7]) + parseInt(numbervalue[68]));
	};

	if (isEven(parseInt(numbervalue[14]))){
		var b = (parseInt(numbervalue[2]) + parseInt(numbervalue[9]) + parseInt(numbervalue[16]) + parseInt(numbervalue[33]) + parseInt(numbervalue[43]) + parseInt(numbervalue[59]) + parseInt(numbervalue[64]) + parseInt(numbervalue[68]) + parseInt(numbervalue[71]) + parseInt(numbervalue[80]));
	} else {
		var b = (parseInt(numbervalue[4]) + parseInt(numbervalue[24]) + parseInt(numbervalue[27]) + parseInt(numbervalue[34]) + parseInt(numbervalue[36]) + parseInt(numbervalue[39]) + parseInt(numbervalue[42]) + parseInt(numbervalue[51]) + parseInt(numbervalue[58]) + parseInt(numbervalue[63]) + parseInt(numbervalue[69]) + parseInt(numbervalue[70]) + parseInt(numbervalue[74]) + parseInt(numbervalue[79]) + parseInt(numbervalue[81]) + parseInt(numbervalue[88]));
	};
	
	return { a, b };
}

function countFours(stringnumbervaluelength, numbervalue) {
	let totalfours = 0;
	for (let i = 0; i < stringnumbervaluelength; i++) {
		if (numbervalue[i] === '4') {
			totalfours++;
		}
	};

	const c = totalfours;
	return c;
}
