

var border;
var board;
var numbers = new Array(6);
var holder = [];
var screenWidth = 600;
var screenHeight = 800;
var gameSize = screenWidth*.7;
var borderSize = gameSize*0.08;
var choosing = false;
var hover = null;
var totalScore = 0;
var pulse = false;
var timeLeft = 90;
var board1;
var matches = 0;

var tvMatches;
var title;
var current;
var score;
var tvChain;
let MAXCHAIN = 5
let ROWNUM = 6;

let PRIMARY = 0x234567
let HOVER = 0x808080;
let SELECTED = 0x404040;
let DESELECTED = 0xFFFFFF;

let SIZEMAP = {
	'title' : 0.125,
	'labels' : 0.06
}

let COLORMAP = [];

/*)
let COLORMAP = {
	'1': '#1f87b6',
	'2': '#31aee6',
	'3': '#7693ff',
	'4': '#a094e8',
	'5': '#7A66EB'
}
*/

var GameState = {
	preload: function(){
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.refresh();
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  

		for (var x = 1; x < 8; x++){
			if (x != 1 && x != 4){
				this.load.image(x+'image', 'assets/images/'+x+'.png');
			}
		}

	},
	create: function(){
		/*
		this.background = this.game.add.sprite(0,0, 'background')
		this.background.width = 500;
		this.background.height = 500;
		*/
		title = this.game.add.text(game.world.width/2,SIZEMAP['title']*game.world.width/2, "S Q U A R E S", {font: SIZEMAP['title']*game.world.width+'px TestFont', fill: '#ffffff'});
		title.anchor.setTo(0.5,0.5);

		var width = gameSize+borderSize // example;
		var height = gameSize+borderSize // example;
		var bmd = game.add.bitmapData(width, height);
		 
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, width, height);
		bmd.ctx.fillStyle = '#9D670F';
		bmd.ctx.fill();
		board = game.add.sprite(game.world.centerX, game.world.height*.3 + bmd.width/2, bmd);
		board.anchor.setTo(0.5, 0.5);

		var width = gameSize // example;
		var height = gameSize // example;
		var bmd1 = game.add.bitmapData(width, height);
		 
		bmd1.ctx.beginPath();
		bmd1.ctx.rect(0, 0, width, height);
		bmd1.ctx.fillStyle = '#EEC27D';
		bmd1.ctx.fill();
		board1 = game.add.sprite(board.centerX-bmd1.width/2, board.centerY-bmd1.height/2, bmd1);
		board1.anchor.setTo(0, 0);


		let labelSize = SIZEMAP['labels']*game.world.width;

		current = this.game.add.text(game.world.width*0.1,game.world.height*.2, "Current: 0", {font: labelSize+'px TestFont', fill: '#ffffff'});

		score = this.game.add.text(game.world.width*0.6,game.world.height*.125, "Score: 0", {font: labelSize+'px TestFont', fill: '#ffffff'});

		tvMatches = this.game.add.text(game.world.width*0.6,game.world.height*.2, "Matches Left: " + (5 - matches), {font: labelSize+'px TestFont', fill: '#ffffff'});

		tvChain = this.game.add.text(game.world.width*0.1,game.world.height*.125, "Max Chain: " + MAXCHAIN, {font: labelSize+'px TestFont', fill: '#ffffff'});

		for (var x = 0; x < ROWNUM; x++){
			numbers[x] = new Array(ROWNUM);
			for (var y = 0; y < ROWNUM; y++){
				spawnBlock(x, y);
			}
		}

		hover = numbers[3][3];
		hoverBlock(hover);

		

		game.input.keyboard.onDownCallback = function(){
			if (game.input.keyboard.event.keyCode == 13||game.input.keyboard.event.keyCode == 32){
				if (!choosing){
					choosing = true;
					holder.push(hover);
					primaryBlock(hover);
				}else{
					choosing = false;
					clearAllBlocks();
					hoverBlock(hover);
				}
			}else{
				if (!choosing){
					if (hover != null){
						if ((game.input.keyboard.event.keyCode == 87||game.input.keyboard.event.keyCode ==38)&&hover.dy>0){
							deHover(hover);
							hover = numbers[hover.dx][hover.dy-1];
							hoverBlock(hover);
						}else if ((game.input.keyboard.event.keyCode == 65 ||game.input.keyboard.event.keyCode ==37)&&hover.dx>0){
							deHover(hover);
							hover = numbers[hover.dx-1][hover.dy];
							hoverBlock(hover);
						}else if ((game.input.keyboard.event.keyCode == 83 ||game.input.keyboard.event.keyCode ==40)&&hover.dy<(ROWNUM-1)){
							deHover(hover);
							hover = numbers[hover.dx][hover.dy+1];
							hoverBlock(hover);
						}else if ((game.input.keyboard.event.keyCode == 68 ||game.input.keyboard.event.keyCode ==39)&&hover.dx<(ROWNUM-1)){
							deHover(hover);
							hover = numbers[hover.dx+1][hover.dy];
							hoverBlock(hover);
						}
					}			
				}else{
					if (hover != null && holder.length < MAXCHAIN){
						if ((game.input.keyboard.event.keyCode == 87||game.input.keyboard.event.keyCode ==38)&&hover.dy>0&&!holder.includes(numbers[hover.dx][hover.dy-1])){
							selectBlock(hover);
							hover = numbers[hover.dx][hover.dy-1];
							holder.push(hover);
							primaryBlock(hover);
						}else if ((game.input.keyboard.event.keyCode == 65 ||game.input.keyboard.event.keyCode ==37)&&hover.dx>0&&!holder.includes(numbers[hover.dx-1][hover.dy])){
							selectBlock(hover);
							hover = numbers[hover.dx-1][hover.dy];
							holder.push(hover);
							primaryBlock(hover);
						}else if ((game.input.keyboard.event.keyCode == 83 ||game.input.keyboard.event.keyCode ==40)&&hover.dy<(ROWNUM-1)&&!holder.includes(numbers[hover.dx][hover.dy+1])){
							selectBlock(hover);
							hover = numbers[hover.dx][hover.dy+1];
							holder.push(hover);
							primaryBlock(hover);
						}else if ((game.input.keyboard.event.keyCode == 68 ||game.input.keyboard.event.keyCode ==39)&&hover.dx<(ROWNUM-1)&&!holder.includes(numbers[hover.dx+1][hover.dy])){
							selectBlock(hover);
							hover = numbers[hover.dx+1][hover.dy];
							holder.push(hover);
							primaryBlock(hover);
						}
					}	
				}
			}
		}

	},
	update: function(){
		if (choosing && hover != null){
			if (pulse){
				hover.alpha+=0.01;
				if (hover.alpha >= 1){pulse = false;}
			}else{
				hover.alpha-=0.01;
				if (hover.alpha <= 0.75){pulse = true;}
			}
		}
	},
}

function clearAllBlocks(){
	for (var x = 0; x < holder.length; x++){
		deHover(holder[x]);
	}
	if (holder.length > 1 && Number.isInteger(Math.sqrt(getTotal()))){
		if (holder.length > Math.sqrt(getTotal())-2){
			let phase1 = (holder.length-2)/(MAXCHAIN-2);
			let phase2 = Math.pow(3,phase1);
			let phase3 = Math.sqrt(getTotal());
			let phase4 = Math.pow(phase3,phase2);
			let plusScore = parseInt(phase4);

			var addedTime = 1000*(2+Math.pow(18,((plusScore-2) / (Math.pow(7,3)-2))));

			console.log(plusScore,addedTime);
			if (addedTime<2000){
				addedTime=2000;
			}


			totalScore += plusScore;

			score.text = "Score: " + totalScore;
			for (var x = 0; x < holder.length; x++){
				var holderx = holder[x].dx;
				var holdery = holder[x].dy;
				holder[x].destroy();
				var newBlock = spawnBlock(holderx, holdery,Math.sqrt(getTotal()));
			}
			matches +=1;
			if (matches % 5 == 0){
				MAXCHAIN += 1;
			}
			tvMatches.text = "Matches Left: "+(5-(matches%5));
			tvChain.text = "Max Chain: "+MAXCHAIN;
			hover = numbers[hover.dx][hover.dy];
			hoverBlock(hover);
		}
	}
	current.text = "Current: 0";
	holder = [];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function getTotal(){
	var tot = 0;
	for (var x = 0; x < holder.length; x++){
		tot = holder[x].value + tot;
	}
	return tot;
}

function spawnBlock(x, y, z){
	var newNum = getRandomIntInclusive(1,MAXCHAIN);
	if (z){
		newNum = z + 1;
	}
	//var newBlock = game.add.sprite(board1.x + gameSize/6*x, board1.y + gameSize/6*y,newNum+'image');

	var bmd = game.add.bitmapData(gameSize/ROWNUM, gameSize/ROWNUM);
	 
	bmd.ctx.beginPath();
	bmd.ctx.rect(0, 0, gameSize/ROWNUM, gameSize/ROWNUM);
	var fillStyle;
	if (!((''+newNum) in COLORMAP)){
		COLORMAP[newNum+''] =  generateRandomColor();
	}
	fillStyle = COLORMAP[newNum + ''];
	bmd.ctx.fillStyle = fillStyle;//COLORMAP[newNum+''];
	console.log(bmd.ctx.fillStyle, newNum);
	//console.log(COLORMAP[newNum+''],newNum);
	bmd.ctx.fill();
	newBlock = game.add.sprite(board1.x + gameSize/ROWNUM*x, board1.y + gameSize/ROWNUM*y, bmd);

	newBlock.value = newNum;
	newBlock.dx = x;
	newBlock.dy = y;
	numbers[x][y] = newBlock;

	this.numberLabel = this.game.add.text(newBlock.width*.5,newBlock.height*.5, newNum, {font: '35px TestFont', fill: '#ffffff'});
	numberLabel.anchor.setTo(0.5,0.5);
	newBlock.addChild(numberLabel);


	return newBlock;
}

function generateRandomColor(){
	var r = (parseInt)((getRandomIntInclusive(0,255)+255)/2);
	var b = (parseInt)((getRandomIntInclusive(0,255)+255)/2);
	var g = (parseInt)((getRandomIntInclusive(0,255)+255)/2);
	var test = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	console.log(test);
	return test;
}

function rgbToHex(r, g, b){
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function primaryBlock(block){
	block.tint = PRIMARY;
	current.text = "Current: "+getTotal() + " (" + holder.length + ")";
}

function hoverBlock(block){
	block.tint = HOVER;
}

function deHover(block){
	block.alpha = 1;
	block.tint = DESELECTED;
}

function selectBlock(block){
	block.alpha = 1;
	block.tint = SELECTED;
}


var game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO,'',null,true);


game.state.add('GameState', GameState);

game.state.start('GameState');