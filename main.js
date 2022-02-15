// l-system config
let str = "CCCCX";
const itr = 11;
const rules = {
    "X": "F[-CX]+CX",
	"F": "CF"
}

// turtle config
let len = 10;
let thick = 16;
const leafThick = 4;
const ang = 16;
const randAng = 15;
const randPercent = 40;
const memory = [];


function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

function generate() {
    for (let index = 0; index < itr; index++) {
        let temp = "";
        for (let char of str) {
            if (rules[char]) {
                temp += rules[char];
            } else {
                temp += char;
            }
        }
        str = temp;
    }
    turtle();
}

function turtle() {
	background(200);
  	translate(width / 2, height - 100);
	for (let char of str) {
		switch (char) {
            // ствол\ветка
			case "F":
                if (randomInteger(0, 100) > randPercent) {
                    line(0,0,0, -len);
                    translate(0, -len);
                }
				break;
            // 
            case "X":
                strokeWeight(leafThick);
                let rand = randomInteger(0, 100);
                if (rand > -1 && rand < 33) {
                    stroke(34, 139, 34);
                } else if (rand > 34 && rand < 66) {
                    stroke(0 ,255, 127);
                } else {
                    stroke(0,100,0);
                }
                line(0,0,0, -len);
                translate(0, -len);
                strokeWeight(thick);
                stroke(51);
				break;
            case "C":
                if (randomInteger(0, 100) > randPercent) {
                    line(0,0,0, -len);
                    translate(0, -len);
                }
				break;
			case "+":
				rotate(radians(ang + randomInteger(-randAng, randAng)));
				break;
			case "-":
				rotate(-radians(ang + randomInteger(-randAng, randAng)));
				break;
			case "[":
                thick = thick * 0.75;
                strokeWeight(thick);
                memory.push([thick]);
				push();
				break;
			case "]":
                thick = memory.pop();
                strokeWeight(thick);
				pop();
				break;
		}
	}
}

function setup() {
	createCanvas(1004, 804);
	background(200);
    strokeWeight(thick);
    generate();
}