var x = 0., y = 240 , z = 20, strobesOn=0, strobeColor=0;
var lyrics = "I am Miguel"
var capture;
var zoom = 4.00;
var zMin = 0.05;
var zMax = 35.00;
var sensativity = 0.005;
var angle = 0;
var capture;

let inconsolata;
function preload() {
  inconsolata = loadFont('Arial.ttf');
}

function setup() {
	setupOsc(12000, 3334);
	createCanvas(displayWidth, displayHeight,WEBGL);
  capture =   createCapture({
    audio: false,
    video: "user"
    // video: { facingMode: {
    //    exact: "environment"
    //  }
    // }
  });
  capture.size(480, 640);
  // filter(INVERT);

  capture.hide();
	textFont(inconsolata);
	textSize(20);
	textAlign(CENTER, CENTER);
}

function draw() {
  background(strobeColor);

if (strobesOn == 0.){
	push();
  rectMode(CENTER);
  noStroke();
	scale(zoom);
	texture(capture);
	plane(300, 200);
	pop();
}

  textSize(z);
	// scale(z);

	text(lyrics, x, y);
	// fill(255);
	// textSize(36);
	// text(lyrics, x, y);
	console.log(x);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < 480 && mouseY > 0 && mouseY < 640) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function mouseWheel(event) {
  zoom += sensativity * event.delta;
  zoom = constrain(zoom, zMin, zMax);
  //uncomment to block page scrolling
  return false;
}

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

	if (address == '/move') {
		x = value[0];
	  y = value[1];
		z = value[2];

	}

  if (address == '/strobes') {
    strobesOn = value[0];
    strobeColor = value[1];
    fade = value[2];
    console.log(strobesOn);


  }

	if (address == '/text') {
		lyrics = value[0];
	}
	if (address == '/zoom') {
		zoom = value[0];
	}
}

function sendOsc(address, value) {
	socket.emit('message', [address].concat(value));
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://192.168.1.181:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: '192.168.1.181'},
			client: { port: oscPortOut, host: '192.168.1.181'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}
