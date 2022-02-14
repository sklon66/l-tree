function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

var turtles_path = []; // array of Turtle objects
var pathPointer = 0;
var turtle;
var turtleSprite;
var tPlane; // graphic plane for pen layer

let once = true;

setup = function() {
	if (!once) return false;
	var canvas = createCanvas(1004, 804);
	canvas.parent("p5Canvas");
	background(200);

	turtleSprite = createSprite(0, 0, 56, 64);
	turtleSprite.addAnimation("moving", "images/turtle_1.png", "images/turtle_4.png");
	// turtleSprite.changeAnimation("moving");
	
	tPlane = createGraphics(width, height); // pen layer
	
	// Start turtle code - recode turtle moving. -------------------------------------
	const itr = 6;
	const ang = 25;
	const axiom = "+X";
	const length = 5;
	const memory = [];
	const rules = {
		"X": "F-[[X]+X]+FC[+FXG]-X",
		"F": "FF"
	}

	let str = axiom;
	let thick = 8;

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

	turtle = new Turtle();
	turtle.x = 203;
	turtle.y = 800;
	turtle.right(180)
	turtle.penColor = turtle.color.black;
	turtle.step = 2
	turtle.lineWidth = thick

	for (let char of str) {
		switch (char) {
			case "F":
				turtle.penDown = true;
				turtle.forward(length + randomInteger(-2, +2));
				turtle.penDown = false;
				break;
			case "C":
				turtle.penColor = turtle.color.green;
				break;
			case "G":
				turtle.penColor = turtle.color.black;
				break;
			case "+":
				turtle.penDown = false;
				turtle.right(ang + randomInteger(-10, +10));
				break;
			case "-":
				turtle.penDown = false;
				turtle.left(ang + randomInteger(-10, +10));
				break;
			case "[":
				turtle.penDown = false;
				thick = Math.round(thick * 0.75);
				memory.push([turtle.x, turtle.y, turtle.angleInRadians, thick])
				turtle.lineWidth = thick
				break;
			case "]":
				turtle.penDown = false;
				const stack = memory.pop();
				turtle.x = stack[0];
				turtle.y = stack[1];
				turtle.angleInRadians = stack[2];
				turtle.lineWidth = stack[3]
				break;
		}
	}
	once = false;
	// End of turtle code ------------------------------------------------------------
};

draw = function() {
	// Playback turtle moving for animation.
	background(200);
	turtle.draw2(pathPointer);
	image(tPlane);
	drawSprites();
	
	pathPointer += 1;
	if (pathPointer >= turtles_path.length) {
		pathPointer = 0;
		tPlane.fill(200);
		tPlane.noStroke();
		tPlane.rect(0, 0, width, height);
	}
};

/** Turtle Data */
function TBody() {
	this.x = 200;
	this.y = 60;
	this.step = 3;
	this.stepAngle = Math.PI / 36;
	this.angleInRadians = 0;
	this.penDown = false;
	this.penColor = "#000000";
	this.lineWidth = 2;
};

/** Turtle class */
function Turtle() {
	var body = new TBody();
	for (var prop in body) {
		this[prop] = body[prop];
	}
	
	this.color = {
		black : "#000000",
		gray: "#808080",
		lightgray: "#C0C0C0",
		red: "#ff0000",
		green: "#00ff00",
		blue: "#0000ff",
		yellow: "#ffff00",
		magenta: "#ff00ff",
		aqua: "#00ffff",
		white: "#ffffff"
	};

	this.forward = function(length) {
		var x0 = this.x;
		var y0 = this.y;
		var xx = sin(this.angleInRadians);
		var yy = cos(this.angleInRadians);
		var count = abs(int(length / this.step));
		var dir = 1;
		if(length < 0) {dir = -1};
		
		for(var i=0; i < count - 1; i++) {
			this.x += dir * this.step * xx;
			this.y += dir * this.step * yy;
			this.copy();			
		}
		this.x = x0 + length * xx;
		this.y = y0 + length * yy;
		this.copy();

	};
	
	this.back = function(length) {
		this.forward(-length);
	};
	
	this.left = function(angleInDegrees) {
		var angle0 = this.angleInRadians;
		var targetAngle = angleInDegrees * Math.PI / 180.0;
		var count = abs(int(targetAngle / this.stepAngle));
		var dir = 1;
		if(targetAngle < 0) {dir = -1};
		
		for(var i=0; i < count - 1; i++) {
			this.angleInRadians += dir * this.stepAngle;
			this.copy();
		}
		this.angleInRadians = angle0 + targetAngle;
		this.copy();
	};
	
	this.right = function(angleInDegrees) {
		this.left(-angleInDegrees);
	};

	// copy TBody object
	this.copy = function() {
		turtles_path.push(new TBody());
		var target = turtles_path[turtles_path.length - 1];
		for (var prop in this) {
			target[prop] = this[prop];
		}
	};
	
	// drawing turtle in loop
	this.draw2 = function(pointer) {
		var target = turtles_path[pointer];
		
		// draw path by Pen
		if (target.penDown) {
			tPlane.strokeWeight(target.lineWidth);
			tPlane.stroke(target.penColor);
			var nextPointer = pointer + 1;
			if(nextPointer >= turtles_path.length) {
				nextPointer = 0;
			}
			tPlane.line(target.x, target.y, turtles_path[nextPointer].x, turtles_path[nextPointer].y);
		}
		
		// draw turtle by sprite
		turtleSprite.rotation = target.angleInRadians * -180 / Math.PI + 180;
		turtleSprite.position.x = target.x;
		turtleSprite.position.y = target.y;
	};
};