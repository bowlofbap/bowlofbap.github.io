TutorialZen = function() {
	screenWidth = 600;
	screenHeight = 800;
	pageNumber = 0;
	SIZEMAP = {
		'title' : 0.075,
		'body' : 0.050
	};
	gameSize = screenWidth*.7;
	borderSize = gameSize*0.08;
	var textLayer;
	var imageLayer;
	turnable = true;
	holder = [];
	numbers = [];
	choosing = false;
	hover = null;
	pulse = false;
	ROWNUM = 6;
	MAXCHAIN = 4;

	 PRIMARY = 0x234567
	 HOVER = 0x808080;
	 SELECTED = 0x404040;
	 DESELECTED = 0xFFFFFF;


};

TutorialZen.prototype = {
	preload: function(){ 
		//Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  
		 game.load.script('Zen',  'JS/zen.js');
   	},
	create: function(){
		game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.rightFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.leftFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.rightFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(this.leftFunction, this);
		textLayer = game.add.group();
		imageLayer = game.add.group();

		this.showPage(0);

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

	startGame: function(){
				game.state.add("Zen",Zen);
			    game.state.start("Zen");
	},

	rightFunction: function(){
			pageNumber += 1;
			textLayer.removeAll();
			imageLayer.removeAll();
			if (pageNumber != 4){
				this.showPage(pageNumber);
			}else{
				this.startGame();
			}
	},
	leftFunction: function(){
			if (pageNumber > 0){
				pageNumber -= 1;
				textLayer.removeAll();
				imageLayer.removeAll();
				this.showPage(pageNumber);
			}
	},
	disablePages: function(){
		game.input.keyboard.removeKey(Phaser.Keyboard.D);
		game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
		game.input.keyboard.removeKey(Phaser.Keyboard.A);
		game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
	},
	enablePages: function(){

	},
	enableGame: function(){
		game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.tileRight, this);
		game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.tileRight, this);
		game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(this.tileLeft, this);
		game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.tileLeft, this);
		game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.enterFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.enterFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.escFunction, this);
	},
	disableGame: function(){
		game.input.keyboard.removeKey(Phaser.Keyboard.D);
		game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
		game.input.keyboard.removeKey(Phaser.Keyboard.A);
		game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
		game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
		game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
		game.input.keyboard.removeKey(Phaser.Keyboard.ESC);
	},
	showPage: function(page){
		if (page == 0){
			text = game.add.text(game.world.width/2,game.world.height/4, "Welcome to Squares!\nPress ⇨ or D to learn how to play or press Space if you already know!", {font: SIZEMAP['title']*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
			text.anchor.setTo(0.5,0.5);
			textLayer.addChild(text);
			game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.startGame, this);
		}else if (page == 1){
			text = game.add.text(game.world.width/2,game.world.height/3, "		The objective is to add up numbers in a chain to create a perfect square (4, 9, 16, etc).\n\n Add numbers to your chain with ENTER and W/A/S/D. Press ESC to cancel your chain.\n\nYour chain normally has a maximum of 5 tiles but you can increase it every time you get 5 perfect squares.", {font: SIZEMAP['body']*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
			text.anchor.setTo(0.5,0.5);
			textLayer.addChild(text);
			game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
		}else if (page == 2){
			text = game.add.text(game.world.width/2,game.world.height/4, "When you get a perfect square, all the tiles in the chain will be replaced with one number higher than the perfect square achieved. Use this to set up your strategy! The higher the chain number and perfect square, the more point you'll earn.\n\nTry matching 4's now to make 16.", {font: SIZEMAP['body']*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
			text.anchor.setTo(0.5,0.5);
			textLayer.addChild(text);

			this.disablePages();
			this.enableGame();

			this.spawnBoard(3);
		}else if (page == 3){
			this.disableGame();
			text = game.add.text(game.world.width/2,game.world.height/4, "One more thing: Your chain must have at least one less than the perfect square's root. So you wouldn't be able to match any of these 12's for 36 because you would need a length of at least 5.\n\n Press Space whenever you want to start the game!", {font: SIZEMAP['body']*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
			text.anchor.setTo(0.5,0.5);
			textLayer.addChild(text);

			this.spawnBoard(11);
			this.deHover(hover);
			choosing = false;
			game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.startGame, this);
		}
	},
	clearBlocks: function(){
		for (var x = 0; x < holder.length; x++){
			this.deHover(holder[x]);
		}
		holder = [];
	},
	clearPoints: function(){
		for (var x = 0; x < holder.length; x++){
			this.deHover(holder[x]);
		}
		if (holder.length > 1 && Number.isInteger(Math.sqrt(this.getTotal()))){
			if (holder.length > Math.sqrt(this.getTotal())-2){
				for (var x = 0; x < holder.length; x++){
					var holderx = holder[x].dx;
					var holdery = holder[x].dy;
					holder[x].destroy();
					var newBlock = this.spawnBlock(holderx, holdery,Math.sqrt(this.getTotal()));
				}
				hover = numbers[hover.dx][hover.dy];
				this.hoverBlock(hover);

				//enable the thing to move on
				//show continue button
				text = game.add.text(game.world.width/2,board1.y+board1.height+game.world.width*0.1, "Good work! Press Space to continue.", {font: SIZEMAP['body']*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
				text.anchor.setTo(0.5,0.5);
				textLayer.addChild(text);
				game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.rightFunction, this);
			}
		}
		holder = [];
	},
	getTotal: function(){
		var tot = 0;
		for (var x = 0; x < holder.length; x++){
			tot = holder[x].value + tot;
		}
		return tot;
	},

	escFunction: function(){
		if (choosing){
			choosing = false;
			this.clearBlocks();
			this.hoverBlock(hover);
		}
	},


	enterFunction: function(){
		if (!choosing){
			choosing = true;
			holder.push(hover);
			this.primaryBlock(hover);
		}else{
			choosing = false;
			this.clearPoints();
			this.hoverBlock(hover);
		}
	},

	tileRight: function(){
		if (hover!=null &&hover.dx<ROWNUM-1){
			if (!choosing){
				this.deHover(hover);
				hover = numbers[hover.dx+1][hover.dy];
				this.hoverBlock(hover);
			}else{
				if (holder.length < MAXCHAIN){
					if (!holder.includes(numbers[hover.dx+1][hover.dy])){
						this.selectBlock(hover);
						hover = numbers[hover.dx+1][hover.dy];
						holder.push(hover);
						this.primaryBlock(hover);
					}
				}
			}
		}
	},

	tileLeft: function(){
		if (hover!=null &&hover.dx>0){
			if (!choosing){
				this.deHover(hover);
				hover = numbers[hover.dx-1][hover.dy];
				this.hoverBlock(hover);
			}else{
				if (holder.length < MAXCHAIN){
					if (!holder.includes(numbers[hover.dx-1][hover.dy])){
						this.selectBlock(hover);
						hover = numbers[hover.dx-1][hover.dy];
						holder.push(hover);
						this.primaryBlock(hover);
					}
				}
			}
		}
	},

	spawnBoard: function(integer){

		var width = gameSize+borderSize // example;
		var height = (gameSize/6+borderSize); // example;
		var bmd = game.add.bitmapData(width, height);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, width, height);
		bmd.ctx.fillStyle = '#9D670F';
		bmd.ctx.fill();
		board = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
		board.anchor.setTo(0.5, 0.5);

		var width = gameSize // example;
		var height = gameSize/6 // example;
		var bmd1 = game.add.bitmapData(width, height);
		 
		bmd1.ctx.beginPath();
		bmd1.ctx.rect(0, 0, width, height);
		bmd1.ctx.fillStyle = '#EEC27D';
		bmd1.ctx.fill();
		board1 = game.add.sprite(board.centerX-bmd1.width/2, board.centerY-bmd1.height/2, bmd1);
		board1.anchor.setTo(0, 0);
		imageLayer.addChild(board1);
		imageLayer.addChild(board);

		for (var x = 0; x < ROWNUM; x++){
			numbers[x] = new Array(ROWNUM);
			for (var y = 0; y < 1; y++){
				this.spawnBlock(x, y, integer);
			}
			hover = numbers[0][0];
			this.hoverBlock(hover);
		}

	},
	spawnBlock: function(x, y, z){
		var newNum = this.getRandomIntInclusive(1,MAXCHAIN);
		if (z){
			newNum = z + 1;
		}
		//var newBlock = game.add.sprite(board1.x + gameSize/6*x, board1.y + gameSize/6*y,newNum+'image');

		var bmd = game.add.bitmapData(gameSize/ROWNUM, gameSize/ROWNUM);
		 
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, gameSize/ROWNUM, gameSize/ROWNUM);
		var fillStyle;
		if (!((''+newNum) in COLORMAP)){
			COLORMAP[newNum+''] =  this.generateRandomColor();
		}
		fillStyle = COLORMAP[newNum + ''];
		bmd.ctx.fillStyle = fillStyle;
		bmd.ctx.fill();
		newBlock = game.add.sprite(board1.x + gameSize/ROWNUM*x, board1.y + gameSize/ROWNUM*y, bmd);

		newBlock.value = newNum;
		newBlock.dx = x;
		newBlock.dy = y;
		numbers[x][y] = newBlock;

		numberLabel = this.game.add.text(newBlock.width*.5,newBlock.height*.5, newNum, {font: '35px TestFont', fill: '#ffffff'});
		numberLabel.anchor.setTo(0.5,0.5);
		newBlock.addChild(numberLabel);
		imageLayer.addChild(newBlock);

		return newBlock;
	},
	getRandomIntInclusive: function(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min; 
	},
	generateRandomColor: function(){
		var r = (parseInt)((this.getRandomIntInclusive(0,255)+235)/2);
		var b = (parseInt)((this.getRandomIntInclusive(0,255)+235)/2);
		var g = (parseInt)((this.getRandomIntInclusive(0,255)+235)/2);
		var test = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		return test;
	},
	rgbToHex: function(r, g, b){
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	},
	primaryBlock: function(block){
		block.tint = PRIMARY;
	},

	hoverBlock: function(block){
		block.tint = HOVER;
	},
	deHover: function(block){
		block.alpha = 1;
		block.tint = DESELECTED;
	},

	selectBlock: function(block){
		block.alpha = 1;
		block.tint = SELECTED;
	},
}
