var GameState = function() {
	 screenWidth = 600;
	 screenHeight = 800;
	 var border;
	 var board;
	 var board1;
	 numbers = new Array(6);
	 holder = [];
	 gameSize = screenWidth*.7;
	 borderSize = gameSize*0.08;
	 choosing = false;
	 hover = null;
	 totalScore = 0;
	 pulse = false;
	 realStartTime = 90;
	 var startTime;
	 matches = 0;
	 var playing = true;
	 var endScreen;

	 var title;
	 var current;
	 var score;
	 var tvTime;
	 MAXCHAIN = 7;
	 ROWNUM = 6;

	 PRIMARY = 0x234567
	 HOVER = 0x808080;
	 SELECTED = 0x404040;
	 DESELECTED = 0xFFFFFF;

	 SIZEMAP = {
		'title' : 0.125,
		'labels' : 0.06,
		'endScreen' : 0.085
	}
	COLORMAP = [];
};

/*)
let COLORMAP = {
	'1': '#1f87b6',
	'2': '#31aee6',
	'3': '#7693ff',
	'4': '#a094e8',
	'5': '#7A66EB'
}
*/

GameState.prototype = {
	preload: function(){
		this.game.scale.refresh();
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  

		for (var x = 1; x < 8; x++){
			if (x != 1 && x != 4){
				this.load.image(x+'image', 'assets/images/'+x+'.png');
			}
		}

	},
	create: function(){

		var me = this;
		playing = true;
	 	startTime = realStartTime;
	    me.startTime = new Date();
	    me.totalTime = startTime;
	    me.timeElapsed = 0;
	    me.gameTimer = game.time.events.loop(100, function(){
	    	me.updateTimer();
	    });

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

		tvTime = this.game.add.text(game.world.width*0.1,game.world.height*.125, "0:00", {font: labelSize+'px TestFont', fill: '#ffffff'});

		for (var x = 0; x < ROWNUM; x++){
			numbers[x] = new Array(ROWNUM);
			for (var y = 0; y < ROWNUM; y++){
				this.spawnBlock(x, y);
			}
		}

		hover = numbers[3][3];
		this.hoverBlock(hover);

		game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.upFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(this.upFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.leftFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(this.leftFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.downFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(this.downFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.rightFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.rightFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(this.enterFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.enterFunction, this);
		game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.escFunction, this);

	 

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
		if(this.timeElapsed >= startTime){
			this.endGame();
		}
	},
	updateTimer: function(){
 
	    var me = this;
	 
	    var currentTime = new Date();
	    var timeDifference = me.startTime.getTime() - currentTime.getTime();
	 
	    //Time elapsed in seconds
	    me.timeElapsed = Math.abs(timeDifference / 1000);
	 
	    //Time remaining in seconds
	    var timeRemaining = startTime - me.timeElapsed; 
	 
	    //Convert seconds into minutes and seconds
	    var minutes = Math.floor(timeRemaining / 60);
	    var seconds = Math.floor(timeRemaining) - (60 * minutes);
	 
	    //Display minutes, add a 0 to the start if less than 10
	    var result = (minutes < 10) ? "0" + minutes : minutes; 
	 
	    //Display seconds, add a 0 to the start if less than 10
	    result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
	 
	    tvTime.text = result;
	 
	},	
	endGame: function(){
		var width = screenWidth // example;
		var height = screenHeight // example;
		var bmd = game.add.bitmapData(width, height);
		 
		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, width, height);
		bmd.ctx.fillStyle = '#AED6F1';
		bmd.ctx.fill();
		endScreen = game.add.sprite(0,0, bmd);
		endScreen.anchor.setTo(0, 0);

		playing = false;

		text = game.add.text(game.world.width/2,game.world.height/4, "Your score was: "+totalScore+"\n\nPress Space or Enter to play again!", {font: SIZEMAP['endScreen']*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
		text.anchor.setTo(0.5,0.5);
		endScreen.addChild(text);
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function(){
			this.restartGameState(); game.state.restart();
		},
		this);
		game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function(){
			this.restartGameState(); game.state.restart();
		},
		this);
	},
	restartGameState: function(){
		 choosing = false;
		 hover = null;
		 totalScore = 0;
		 startTime = realStartTime;
		 pulse = false;
		 playing = true;
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
			this.clearAllBlocks();
			this.hoverBlock(hover);
		}
	},

	upFunction: function(){
		if (hover!=null &&hover.dy>0){
			if (!choosing){
				this.deHover(hover);
				hover = numbers[hover.dx][hover.dy-1];
				this.hoverBlock(hover);
			}else{
				if (holder.length < MAXCHAIN){
					if (!holder.includes(numbers[hover.dx][hover.dy-1])){
						this.selectBlock(hover);
						hover = numbers[hover.dx][hover.dy-1];
						holder.push(hover);
						this.primaryBlock(hover);
					}
				}
			}
		}
	},
	leftFunction: function(){
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
	downFunction: function(){
		if (hover!=null &&hover.dy<ROWNUM-1){
			if (!choosing){
				this.deHover(hover);
				hover = numbers[hover.dx][hover.dy+1];
				this.hoverBlock(hover);
			}else{
				if (holder.length < MAXCHAIN){
					if (!holder.includes(numbers[hover.dx][hover.dy+1])){
						this.selectBlock(hover);
						hover = numbers[hover.dx][hover.dy+1];
						holder.push(hover);
						this.primaryBlock(hover);
					}
				}
			}
		}
	},
	rightFunction: function(){
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

	spawnBlock: function(x, y, z){
		var newNum = this.getRandomIntInclusive(2,MAXCHAIN+1);
		if (z){
			newNum = z + 1;//to spawn the number
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


		return newBlock;
	},
	clearAllBlocks: function(){
		for (var x = 0; x < holder.length; x++){
			this.deHover(holder[x]);
		}
		if (holder.length > 1 && Number.isInteger(Math.sqrt(this.getTotal()))){
			let phase1 = (holder.length-2)/(MAXCHAIN-1);
			let phase2 = Math.pow(3,phase1);
			let phase3 = Math.sqrt(this.getTotal());
			let phase4 = Math.pow(phase3,phase2);
			let plusScore = parseInt(phase4);

			//var addedTime = 1000*(2+Math.pow(18,((plusScore-2) / (Math.pow(7,3)-2))));
			var addedTime = 1000*(Math.pow(1.3,Math.log(plusScore,10)));
			console.log(addedTime);
			if (addedTime<1000){
				addedTime=1000;
			}

			totalScore += plusScore;
			startTime += addedTime/1000;

			score.text = "Score: " + totalScore;
			for (var x = 0; x < holder.length; x++){
				var holderx = holder[x].dx;
				var holdery = holder[x].dy;
				holder[x].destroy();
				var newBlock = this.spawnBlock(holderx, holdery);
			}
			hover = numbers[hover.dx][hover.dy];
			this.hoverBlock(hover);
		}
		current.text = "Current: 0";
		holder = [];
	},
	clearBlocks: function(){
		for (var x = 0; x < holder.length; x++){
			this.deHover(holder[x]);
		}
		current.text = "Current: 0";
		holder = [];
	},
	getRandomIntInclusive: function(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min; 
	},

	getTotal: function(){
		var tot = 0;
		for (var x = 0; x < holder.length; x++){
			tot = holder[x].value + tot;
		}
		return tot;
	},
	generateRandomColor: function(){
		var r = (parseInt)((this.getRandomIntInclusive(0,255)+255)/2);
		var b = (parseInt)((this.getRandomIntInclusive(0,255)+255)/2);
		var g = (parseInt)((this.getRandomIntInclusive(0,255)+255)/2);
		var test = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		return test;
	},
	rgbToHex: function(r, g, b){
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	},
	primaryBlock: function(block){
		block.tint = PRIMARY;
		current.text = "Current: "+this.getTotal() + " (" + holder.length + ")";
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