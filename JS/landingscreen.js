var game = new Phaser.Game(600, 800, Phaser.AUTO,'',null,true), Landing = function() {
	screenWidth = 600;
	screenHeight = 800;
};

Landing.prototype = {
	preload: function(){ 
		//Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)  
		 game.load.script('TutorialZen',  'JS/tutorialzen.js');
		 game.load.script('TutorialMain',  'JS/tutorialmain.js');
   	},
	create: function(){
		text = game.add.text(game.world.width/2,game.world.height/4, "Press T for Time Attack \nand Z for Zen mode", {font: 0.085*game.world.width+'px TestFont', fill: '#ffffff', wordWrap: true, wordWrapWidth: game.world.width});
		text.anchor.setTo(0.5,0.5);
		game.input.keyboard.addKey(Phaser.Keyboard.T).onDown.add(this.startMain, this);
		game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(this.startZen, this);
	},

	update: function(){

	},

	startZen: function(){
		game.state.add("TutorialZen",TutorialZen);
	    game.state.start("TutorialZen");
	},

	startMain: function(){
		game.state.add("TutorialMain",TutorialMain);
	    game.state.start("TutorialMain");
	},
}

game.state.add('Landing', Landing);
game.state.start('Landing');