/*
* Temporary file to hold the generator for conveniance sake
* May or may not delete this in the end
* if not used, delete for security reasons
*/

const express = require('express')
const app = express()
const path = require('path');

var url = require('url');
var dt = require('./date-time');


const majorVersion = 1
const minorVersion = 2

app.use(express.static(__dirname + '/static/'))

app.get('/generate', (request, response) => {
	app.use(express.static(__dirname + '/generate'))
    response.sendFile(path.join(__dirname + '/generate/index.html'))
})


const lower = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
const upper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
const nums = ["0", "1", "3", "4", "5", "6", "7", "8", "9"];
const special = ["!", "@", "#", "$", "%", "&", "*"];

const lower2 = ["a", "b", "d", "f", "g", "h", "j", "k"];
const upper2 = ["A", "C", "D", "E", "F", "G", "H", "J"];
const nums2 = ["0", "3", "4", "5", "6", "8", "9"];
const special2 = ["!", "#", "$", "%", "&"];

const lower3 = ["d", "e", "f", "g", "h", "i", "j", "k"];
const upper3 = ["A", "B", "C", "D", "E", "I", "J", "K"];
const nums3 = ["3", "4", "5","0", "1", "8", "9"];
const special3 = [ "#", "@", "%", "&", "*", "$","!"];

const Pool1 = [lower, upper, nums, special];
const Pool2 = [lower2, upper2, nums2, special2];
const Pool3 = [lower3, upper3, nums3, special3];
const PoolArr = [Pool1, Pool2, Pool3];

function ShuffleArray(tempArray, tempShuffled, keyNum){
    let _tempArray = [];
    let _tempShuffled = tempShuffled;
    let leng = tempArray.length;

    let x = 0;
    let positionX = 0;
    if (leng != 0){
        while (x < keyNum){
            if (positionX + 1 < leng){
                ++positionX;
            } else {
                positionX = 0;
            }
            ++x;
        }
        for (let i = 0; i < leng; ++i){
            if (i == positionX){
                _tempShuffled.push(tempArray[i]);
            } else {
                _tempArray.push(tempArray[i]);
            }
        }
        return ShuffleArray(_tempArray, _tempShuffled, keyNum);
    }
    return _tempShuffled; 
}

/*app.get('/sendInput', (request, response) => {
	console.log('Calling "/send-Input" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	const userInput1 = parseInt(inputs.letters)
	const userInput2 = parseInt(inputs.digits)
    const userInput3 = parseInt(inputs.specials)
    const userInput4 = parseInt(inputs.leng)
    //Check if the height and weight went through fine
	console.log('letters:' + userInput1)
	console.log('numbers:' + userInput2)
    console.log('specials:' + userInput3)
	console.log('length:' + userInput4)
	
    response.type('text/plain')
	let password_gen = "password?"
	response.send(password_gen)
})*/