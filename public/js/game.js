function gameDeclareGlobals() {
	//console.log("gameDeclareGlobals");
	frogGame = new FrogGame();
	bflyGame = new BflyGame();
	bubbleGame = new BubbleGame();
	snowflakeGame = new SnowflakeGame();
}

//Single Sprite Game

function SpriteGame(name) {
	//console.log("SpriteGame");
	this.name = name;
	this.timers = new Object();
	//this.responders = new Object();
	this.images = new Object();
	//this.sprite = null;
	this.sprites = new Array();
	this.touchReporter = null;
	//console.log("SpriteGame exit");
}

SpriteGame.prototype.initiate = function() {
	//console.log("SpriteGame.initiate");
	this.touchReporter = null;
	this.plugIn();
	for (i = 0; i < this.sprites.length; i ++ ) {
		this.sprites[i].initiate();
	}
	//console.log("SpriteGame.initiate exit");
}

SpriteGame.prototype.finalize = function() {
	//console.log("SpriteGame.finalize");
	this.touchReporter = null;
	this.stopTimers();
	for (i = 0; i < this.sprites.length; i ++ ) {
		this.sprites[i].finalize();
	}
	this.plugOut();
	//console.log("SpriteGame.finalize exit");
}

SpriteGame.prototype.touch = function() {
	//console.log("SpriteGame.touch");
	for (i = 0; i < this.sprites.length; i ++ ) {
		var sprite = this.sprites[i];
		//console.log("i: " + i + ", " + "sprite: " + sprite.description());
		sprite.reflectClick(sprite);
	}
	//console.log("SpriteGame.touch exit");
}

SpriteGame.prototype.reportTouch = function() {
	if (this.touchReporter != null) {
		//console.log("reporting touch");
		this.touchReporter();
	}
	else {
		//console.log("no touchReporter");
	}
}


SpriteGame.prototype.plugIn = function() {
	//console.log("SpriteGame.plugIn");
	window.removeEventListener("touchmove", window.touchMoveHandler, false);
	window.addEventListener("touchmove", function(event){this.touchMoveHandler(event, this)}, false);
	removeChildrenInElemWithId("canvas_page");
	for (i = 0; i < this.sprites.length; i ++ ) {
		var sprite = this.sprites[i];
		//console.log("i: " + i + ", " + "sprite: " + sprite.description());
		appendChildToElemWithId("canvas_page", sprite.container);
	}
	this.addEventListeners(this);
	//console.log("SpriteGame.plugIn exit");
}

SpriteGame.prototype.plugOut = function() {
	//console.log("SpriteGame.plugOut");
	window.removeEventListener("touchmove", function(event){this.touchMoveHandler(event, this)}, false);
	window.addEventListener("touchmove", window.touchMoveHandler, false);
	removeChildrenInElemWithId("canvas_page");
	this.removeEventListeners();
	//console.log("SpriteGame.plugOut exit");
}

SpriteGame.prototype.addEventListeners = function() {
	//console.log("SpriteGame.addEventListeners");
	var game = this;
	for (i = 0; i < this.sprites.length; i ++ ) {
		var sprite = this.sprites[i];
		//console.log("i: " + i + ", " + "sprite: " + sprite.description());
		sprite.addEventListeners(sprite);
	}
	//console.log("SpriteGame.addEventListeners exit");
}

SpriteGame.prototype.removeEventListeners = function() {
	//console.log("SpriteGame.removeEventListeners");
	var game = this;
	for (i = 0; i < this.sprites.length; i ++ ) {
		var sprite = this.sprites[i];
		sprite.removeEventListeners(sprite);
	}
	//console.log("SpriteGame.removeEventListeners exit");
}

SpriteGame.prototype.setTimeout = function(timerName, handler, delay, target) {
	//console.log("SpriteGame.setTimeout", "name: " + timerName, "timer: " + this.timers[timerName]);
	if (this.timers[timerName]) {
		clearTimeout(this.timers[timerName])
		this.timers[timerName] = null;
	}
	this.timers[timerName] = setTimeout(handler, delay, target);
	//console.log("SpriteGame.setTimeout exit", "timer: " + this.timers[timerName]);
}

SpriteGame.prototype.clearTimeout = function(timerName) {
	//console.log("SpriteGame.clearTimeout", "name:" + timerName);
	if (this.timers[timerName]) {
		clearTimeout(this.timers[timerName])
		this.timers[timerName] = null;
	}
	//console.log("SpriteGame.clearTimeout exit");
}

SpriteGame.prototype.stopTimers = function() {
	//console.log("SpriteGame.stopTimers");
	for (key in this.timers) {
		//console.log("key: " + key, "timer: " + this.timers[key]);
		if (this.timers[key]) {
			clearTimeout(this.timers[key])
			this.timers[key] = null;
		}
	}
	//console.log("SpriteGame.stopTimers exit");
}

SpriteGame.prototype.touchMoveHandler = function(event, sprite) {
	//console.log("SpriteGame.touchMoveHandler");
	//console.log(self);
	//console.log(sprite);
	var curTouchX, curTouchY, rect;
	event.preventDefault();
	curTouchX = event.touches[0].clientX;
	curTouchY = event.touches[0].clientY;
	rect = sprite.container.getBoundingClientRect();
	if (curTouchY > rect.top && curTouchY < rect.bottom && curTouchX < rect.right && curTouchX > rect.left) {
		sprite.reflectClick(sprite);
	}
	//console.log("SpriteGame.touchMoveHandler exit");
}

//Sprite

function Sprite(game, spriteNo, readyImageNo) {
	//console.log("Sprite");
	this.name = game.name;
	this.spriteNo = spriteNo;
	this.game = game;
	this.width = 260;
	this.height = 260;
	this.ready = false;
	this.container = createDiv(null, "sprite", "sprite_" + this.name);
	//game.responders["container" + spriteNo] = this.container;
	this.readyImage = getImageElem("sprites", this.name + "-0" + readyImageNo, "sprite");
	//game.responders["readyImage" + spriteNo] = this.readyImage;
	replaceChildren(this.container, this.readyImage);
	this.posX = window.innerWidth / 2;
	this.posY = this.height / 2;
	this.distX = 0;
	this.distY = 0;
	this.dist = 0;
	this.angle = 0;
	this.transCurve = "linear";
	this.transDuration = 0.5;
	this.transWinRatio = 1;
	reflectSpritePos(this);
	reflectSpriteAngle(this);
	reflectSpriteTransition(this);
	//console.log("Sprite exit");
}

Sprite.prototype.addEventListeners = function(self) {
	//console.log("Sprite.addEventListeners, " + this.description());
	this.container.addEventListener("touchmove", function(event){event.preventDefault(); self.game.touchMoveHandler(event, self)}, false)
	this.container.addEventListener("mousedown", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	this.container.addEventListener("touchstart", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	this.readyImage.addEventListener("touchmove", function(event){event.preventDefault(); self.game.touchMoveHandler(event, self)}, false)
	this.readyImage.addEventListener("mousedown", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	this.readyImage.addEventListener("touchstart", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	//console.log("Sprite.addEventListeners exit");
}

Sprite.prototype.removeEventListeners = function(self) {
	//console.log("Sprite.removeEventListeners, " + this.description());
	this.container.removeEventListener("touchmove", function(event){event.preventDefault(); self.game.touchMoveHandler(event, self)}, false)
	this.container.removeEventListener("mousedown", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	this.container.removeEventListener("touchstart", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	this.readyImage.removeEventListener("touchmove", function(event){event.preventDefault(); self.game.touchMoveHandler(event, self)}, false)
	this.readyImage.removeEventListener("mousedown", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	this.readyImage.removeEventListener("touchstart", function(event){event.preventDefault(); self.game.reportTouch(); self.reflectClick(self)}, false);
	//console.log("Sprite.removeEventListeners exit");
}

Sprite.prototype.reflectClick = function(self) {
	//console.log("SpriteGame.reflectClick", "name:" + self.name);
	//console.log("SpriteGame.reflectClick exit");
}

Sprite.prototype.initiate = function() {
	//console.log("SpriteGame.initiate");
	//console.log("SpriteGame.initiate exit");
}

Sprite.prototype.finalize = function() {
	//console.log("SpriteGame.finalize");
	//console.log("SpriteGame.finalize exit");
}

Sprite.prototype.setReady = function(self) {
	//console.log("Sprite.setReady");
	replaceChildren(self.container, self.readyImage);
	self.ready = true;
}

Sprite.prototype.gotoCenter = function(self) {
	//console.log("Sprite.gotoCenter");
	centerSprite(self);
}

Sprite.prototype.description = function() {
	return "name: " + this.name + ", spriteNo: " + this.spriteNo;
}


Sprite.prototype.gotoRandom = function(self) {
	//console.log("Sprite.gotoRandom");
	var windowDiagonal, minNewPosX, maxNewPosX, maxDistX, newPosX, distX, minNewPosY, maxNewPosY, maxDistY, newPosY, distY, maxDist, dist, maxDistFraction, distFraction;

	windowDiagonal = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);

	minNewPosX = self.width / 2;
	maxNewPosX = window.innerWidth - self.width / 2;
	maxDistX = Math.max(maxNewPosX - self.posX, self.posX - self.width / 2);

	minNewPosY = self.height / 2;
	maxNewPosY = window.innerHeight - self.height / 2;
	maxDistY = Math.max(maxNewPosY - self.posY, self.posY - self.height / 2);

	maxDist = Math.sqrt(maxDistX * maxDistX + maxDistY * maxDistY)
	maxDistFraction = maxDist / windowDiagonal;


	do {
		newPosX = minNewPosX + Math.random() * (maxNewPosX - minNewPosX);
		distX = Math.abs(newPosX - self.posX);

		newPosY = minNewPosY + Math.random() * (maxNewPosY - minNewPosY);
		distY = Math.abs(newPosY - self.posY);

		dist = Math.sqrt(distX * distX + distY * distY);
		distFraction = dist / windowDiagonal;

	} while (distFraction < maxDistFraction / 3);
	self.posX = newPosX;
	self.posY = newPosY;
	//reflectSpritePos(self);
	return distFraction;
	//console.log("Sprite.gotoRandom exit");
}

//Frog Game

function FrogGame() {
	//console.log("FrogGame");
	SpriteGame.call(this, "frog");
	var sprite = new FrogSprite(this);
	this.sprites.push(sprite);
	//console.log("FrogGame exit");
}

FrogGame.prototype = Object.create(SpriteGame.prototype);
FrogGame.prototype.constructor = FrogGame;

function FrogSprite(game) {
	//console.log("FrogSprite");
	Sprite.call(this, game, 1, 1);
	this.jumpingImage = getImageElem("sprites", this.name + "-02", "sprite");
	//game.responders["jumpingImage"] = this.jumpingImage;
	this.blinkingImage = getImageElem("sprites", this.name + "-03", "sprite");
	//game.responders["blinkingImage"] = this.blinkingImage;
	//console.log("FrogSprite exit");
}

FrogSprite.prototype = Object.create(Sprite.prototype);
FrogSprite.prototype.constructor = FrogSprite;

FrogSprite.prototype.initiate = function() {
	//console.log("FrogSprite.initiate");
	this.posX = window.innerWidth / 2;
	this.posY = this.height / 2;
	this.angle = 0;
	reflectSpritePos(this);
	reflectSpriteAngle(this);
	playSound("quack");
	this.game.setTimeout("gotoCenterTimer", this.gotoCenter, 100, this);
	this.game.setTimeout("setReadyTimer", this.setReady, 700, this);
	this.game.setTimeout("blinkTimer", this.blink, 5000, this);
	//console.log("FrogSprite.initiate exit");
}

FrogSprite.prototype.reflectClick = function(self) {
	//console.log("FrogSprite.reflectClick");
	if (self.ready) {
		self.ready = false;
		playSound("quack");
		self.jump(self);
		self.game.setTimeout("setReadyTimer", self.setReady, 600, self);
	}
	//console.log("FrogSprite.reflectClick exit");
}

FrogSprite.prototype.jump = function(self) {
	//console.log("FrogSprite.jump");
	var oldPosX = self.posX;
	replaceChildren(self.container, self.jumpingImage);
	self.gotoRandom(self);
	reflectSpritePos(self);
	if (self.posX - oldPosX > window.innerWidth / 2) {
		self.angle = 360;
		reflectSpriteAngle(self)
	}
	else {
		if (oldPosX - self.posX > window.innerWidth / 2) {
			self.angle = 0;
			reflectSpriteAngle(self)
		}
	}
	//console.log("FrogSprite.jump exit");
}

FrogSprite.prototype.blink = function(self) {
	//console.log("FrogSprite.blink");
	//var self = this;
	if (self.ready) {
		replaceChildren(self.container, self.blinkingImage);
		self.game.setTimeout("blinkDoneTimer", self.blinkDone, 200, self);
	}
	else {
		//console.log("not ready");
		self.game.setTimeout("blinkTimer", self.blink, 3000 + Math.random() * 10000, self);
	}
	//console.log("FrogSprite.blink exit");
}

FrogSprite.prototype.blinkDone = function(self) {
	//console.log("FrogSprite.blinkDone");
	if (self.ready) {
		replaceChildren(self.container, self.readyImage);
	}
	self.game.setTimeout("blinkTimer", self.blink, 3000 + Math.random() * 10000, self);
	//console.log("FrogSprite.blinkDone exit");
}

//BflyGame

function BflyGame() {
	//console.log("BflyGame");
	SpriteGame.call(this, "bfly");
	var sprite = new BflySprite(this);
	this.sprites.push(sprite);
	//console.log("BflyGame exit");
}

BflyGame.prototype = Object.create(SpriteGame.prototype);
BflyGame.prototype.constructor = BflyGame;

function BflySprite(game) {
	//console.log("BflySprite");
	var i, frame;
	Sprite.call(this, game, 1, 1);
	this.frames = new Array();
	this.transCurve = "ease";
	this.transDuration = 3;
	reflectSpriteTransition(this);
	this.frameNo = 0;
	this.step = 1;
	for (i = 1; i <= 8; i ++ ) {
		frame = getImageElem("sprites", this.name + "-0" + i, "sprite")
		this.frames.push(frame);
	}
	//console.log("BflySprite exit");
}

BflySprite.prototype = Object.create(Sprite.prototype);
BflySprite.prototype.constructor = BflySprite;

BflySprite.prototype.initiate = function() {
	//console.log("BflySprite.initiate");
	this.posX = window.innerWidth / 2;
	this.posY = this.height / 2;
	this.angle = 0;
	reflectSpritePos(this);
	reflectSpriteAngle(this);
	playSound("chimes");
	this.game.setTimeout("gotoCenterTimer", this.gotoCenter, 100, this);
	this.game.setTimeout("setReadyTimer", this.setReady, 700, this);
	this.game.setTimeout("randomFlapTimer", this.randomFlap, 3000, this);
	//console.log("BflySprite.initiate exit");
}

BflySprite.prototype.nextFrame = function(self) {
	self.frameNo += self.step;
	if (self.frameNo == 8) {
		self.step = -1;
		self.frameNo = 6;
		self.game.setTimeout("frameTimer", self.nextFrame, 50, self);
	}
	else {
		if (self.frameNo == 0) {
			self.step = 1;
		}
		else {
			self.game.setTimeout("frameTimer", self.nextFrame, 50, self);
		}
	}
	replaceChildren(self.container, self.frames[self.frameNo]);
}

BflySprite.prototype.reflectClick = function(self) {
	//console.log("BflySprite.reflectClick");
	if (self.ready) {
		playSound("chimes");
		self.ready = false;
		self.gotoRandom(self);
		reflectSpritePos(self);
		self.angle = Math.random() * 360 - 180;
		reflectSpriteAngle(self);
		self.flap(self);
		self.game.setTimeout("readyTimer", self.setReady, 2000, self);
	}
	//console.log("BflySprite.reflectClick exit");
}

BflySprite.prototype.setReady = function(self) {
	//console.log("BflySprite.setReady");
	self.ready = true;
	self.flap(self);
	//console.log("BflySprite.setReady exit");
}

BflySprite.prototype.randomFlap = function(self) {
	//console.log("BflySprite.randomFlap");
	if (self.ready) {
		self.flap(self);
		self.angle += Math.random() * 30 - 15;
		reflectSpriteAngle(self);
	}
	else {
		//console.log("not ready");
	}
	self.game.setTimeout("randomFlapTimer", self.randomFlap, 2000 + Math.random() * 5000, self);
	//console.log("BflySprite.randomFlap exit");
}

BflySprite.prototype.flap = function(self) {
	//console.log("BflySprite.flap");
	self.game.setTimeout("frameTimer", self.nextFrame, 50, self);
	//console.log("BflySprite.flap exit");
}


//Bubble Game


function BubbleGame() {
	//console.log("BubbleGame");
	SpriteGame.call(this, "bubble");
	var sprite1 = new BubbleSprite(this, 1);
	this.sprites.push(sprite1);
	var sprite2 = new BubbleSprite(this, 2);
	this.sprites.push(sprite2);
	//console.log("BubbleGame exit");
}

BubbleGame.prototype = Object.create(SpriteGame.prototype);
BubbleGame.prototype.constructor = BubbleGame;

function BubbleSprite(game, bubbleNo) {
	//console.log("BubbleSprite, bubbleNo: " + bubbleNo);
	var i, frame;
	Sprite.call(this, game, bubbleNo, bubbleNo);
	this.bubbleNo = bubbleNo;
	this.frames = new Array();
	this.transCurve = "ease";
	this.transDurationMax = 32;
	this.transDuration = this.transDurationMax;
	reflectSpriteTransition(this);
	this.frameNo = 0;
	this.step = 1;
	var name = this.name + "-0" + bubbleNo;
	//console.log("name: " + name);
	frame = getImageElem("sprites", name, "sprite")
	this.frames.push(frame);
	//console.log("BubbleSprite exit, bubbleNo: " + this.bubbleNo);
}

BubbleSprite.prototype = Object.create(Sprite.prototype);
BubbleSprite.prototype.constructor = BubbleSprite;

BubbleSprite.prototype.initiate = function() {
	//console.log("BubbleSprite.initiate, bubbleNo: " + this.bubbleNo);
	this.posX = window.innerWidth / 2;
	this.posY = window.innerHeight * ((2 * this.bubbleNo) - 1) / 4;
	this.angle = 0;
	reflectSpritePos(this);
	reflectSpriteAngle(this);
	//playSound("chimes");
	//this.game.setTimeout("gotoCenterTimer" + this.bubbleNo, this.gotoCenter, 100, this);
	this.game.setTimeout("moveTimer" + this.bubbleNo, this.move, 1, this);
	//console.log("BubbleSprite.initiate exit, bubbleNo: " + this.bubbleNo);
}

BubbleSprite.prototype.move = function(self) {
	//console.log("BubbleSprite.move, bubbleNo: " + self.bubbleNo);
	var distFraction = self.gotoRandom(self);
	self.transDuration = self.transDurationMax * distFraction;
	reflectSpriteTransition(self);
	reflectSpritePos(self);
	self.angle = Math.random() * 360 - 180;
	reflectSpriteAngle(self);
	self.game.setTimeout("moveTimer" + self.bubbleNo, self.move, self.transDuration * 1000, self);
	//console.log("BubbleSprite.move exit, bubbleNo: " + self.bubbleNo);
}

//Snowflake Game


function SnowflakeGame() {
	//console.log("SnowflakeGame");
	SpriteGame.call(this, "snowflake");
	var sprite1 = new SnowflakeSprite(this, 1);
	this.sprites.push(sprite1);
	var sprite2 = new SnowflakeSprite(this, 2);
	this.sprites.push(sprite2);
	//console.log("SnowflakeGame exit");
}

SnowflakeGame.prototype = Object.create(SpriteGame.prototype);
SnowflakeGame.prototype.constructor = SnowflakeGame;

function SnowflakeSprite(game, snowflakeNo) {
	//console.log("SnowflakeSprite, snowflakeNo: " + snowflakeNo);
	var i, frame;
	Sprite.call(this, game, snowflakeNo, snowflakeNo);
	this.snowflakeNo = snowflakeNo;
	this.frames = new Array();
	this.transCurve = "ease";
	this.transDurationMax = 32;
	this.transDuration = this.transDurationMax;
	reflectSpriteTransition(this);
	this.frameNo = 0;
	this.step = 1;
	var name = this.name + "-0" + snowflakeNo;
	//console.log("name: " + name);
	frame = getImageElem("sprites", name, "sprite")
	this.frames.push(frame);
	//console.log("SnowflakeSprite exit, snowflakeNo: " + this.snowflakeNo);
}

SnowflakeSprite.prototype = Object.create(Sprite.prototype);
SnowflakeSprite.prototype.constructor = SnowflakeSprite;

SnowflakeSprite.prototype.initiate = function() {
	//console.log("SnowflakeSprite.initiate, snowflakeNo: " + this.snowflakeNo);
	this.posX = window.innerWidth / 2;
	this.posY = window.innerHeight * ((2 * this.snowflakeNo) - 1) / 4;
	this.angle = 0;
	reflectSpritePos(this);
	reflectSpriteAngle(this);
	//playSound("chimes");
	//this.game.setTimeout("gotoCenterTimer" + this.snowflakeNo, this.gotoCenter, 100, this);
	this.game.setTimeout("moveTimer" + this.snowflakeNo, this.move, 1, this);
	//console.log("SnowflakeSprite.initiate exit, snowflakeNo: " + this.snowflakeNo);
}

SnowflakeSprite.prototype.move = function(self) {
	//console.log("SnowflakeSprite.move, snowflakeNo: " + self.snowflakeNo);
	var distFraction = self.gotoRandom(self);
	self.transDuration = self.transDurationMax * distFraction;
	reflectSpriteTransition(self);
	reflectSpritePos(self);
	self.angle = Math.random() * 360 - 180;
	reflectSpriteAngle(self);
	self.game.setTimeout("moveTimer" + self.snowflakeNo, self.move, self.transDuration * 1000, self);
	//console.log("SnowflakeSprite.move exit, snowflakeNo: " + self.snowflakeNo);
}


//Utilities

function reflectSpritePos(sprite) {
	//console.log("reflectSpritePos", "name:" + sprite.name, "posX:" + sprite.posX, "posY:" + sprite.posY);
	sprite.container.style.left = (sprite.posX - sprite.width / 2) + "px";
	sprite.container.style.top = (sprite.posY - sprite.height / 2) + "px";
	//console.log("reflectSpritePos exit");
}

function reflectSpriteAngle(sprite) {
	//console.log("reflectSpriteAngle", "name:" + sprite.name, "posX:" + sprite.posX, "posY:" + sprite.posY);
	sprite.container.style.transform = "rotate(" + sprite.angle + "deg)";
	sprite.container.style.WebkitTransform = "rotate(" + sprite.angle + "deg)";
	//console.log("reflectSpriteAngle exit");
}

function reflectSpriteTransition(sprite) {
	sprite.container.style.transition = "all " + sprite.tranDuration + "s " + sprite.transCurve;
	sprite.container.style.WebkitTransition = "all " + sprite.transDuration + "s " + sprite.transCurve;
}

function centerSprite(sprite) {
	//console.log("centerSprite", "name:" + sprite.name);
	sprite.posX = window.innerWidth / 2;
	sprite.posY = window.innerHeight / 2;
	reflectSpritePos(sprite);
	//console.log("centerSprite exit");
}
