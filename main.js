let str = "22220";
let temp = "";
let level = 0;
const itr = 12;
const rules = {
    "0": { shift: "1[-20][+20]" },
	"1": { shift: "21" },
    "[": {
        subRule: () => {
            level += 1
        }
    },
    "]": {
        subRule: () => {
            level -= 1
        }
    },
    "2": {
        subRule: () => {
            if (randomInteger(0, 100) < 7 && level > 2) {
                temp.slice();
                temp += "3[*30]";
            }
        }
    }
}

let len = 10;
let thick = 30;
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
        temp = "";
        for (let char of str) {
            if (rules[char]?.shift) {
                temp += rules[char].shift;
            } else {
                temp += char;
            }
            if (rules[char]?.subRule) rules[char].subRule()
        }
        str = temp;
    }
    turtle();
}

function turtle() {
	background(200);
  	translate(width / 2, height-10);
	for (let char of str) {
		switch (char) {
            case "0":
                strokeWeight(leafThick);
                let rand = randomInteger(0, 100);
                if (rand > -1 && rand < 33) {
                    stroke(34, 139, 34);
                } else if (rand > 34 && rand < 66) {
                    stroke(0 ,255, 127);
                } else {
                    stroke(0,100,0);
                }
                line(0,0,0, -(len - 5));
                translate(0, -(len - 5));
                strokeWeight(thick);
                stroke(51);
				break;
			case "+":
				rotate(radians(ang + randomInteger(-randAng, randAng)));
				break;
			case "-":
				rotate(-radians(ang + randomInteger(-randAng, randAng)));
				break;
            case "*":
                const adAng = randomInteger(-30, 30);
                if (adAng < 0) {
                    rotate(-radians(adAng-25))
                } else {
                    rotate(-radians(adAng+25))
                }
                break;
			case "[":
                thick *= 0.86;
                strokeWeight(thick);
                memory.push([thick]);
				push();
				break;
			case "]":
                thick = memory.pop();
                strokeWeight(thick);
				pop();
				break;
            default:
                if (randomInteger(0, 100) > randPercent) {
                    line(0,0,0, -len);
                    translate(0, -len);
                }
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