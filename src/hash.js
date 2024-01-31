import * as crypto from "crypto";

/**
 * 
 * @param {string} x the username we're hashing 
 * @returns 
 */
export function generateIndexes(x) {

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
	const a = parseInt(numbervalue[24]) + parseInt(numbervalue[1]) + parseInt(numbervalue[75]);
	const b = (parseInt(numbervalue[2]) + parseInt(numbervalue[9]) + parseInt(numbervalue[16]) + parseInt(numbervalue[23]) + parseInt(numbervalue[38]) + parseInt(numbervalue[43]) + parseInt(numbervalue[59]) + parseInt(numbervalue[64]) + parseInt(numbervalue[71]) + parseInt(numbervalue[80]) + parseInt(numbervalue[87]));
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
