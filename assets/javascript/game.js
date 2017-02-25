var attackMultiplier = 1;
var playerSelected = false,
	enemySelected = false;

refreshCharacters();
populateCharacters('#character-select');

function Character(name, hp, attack, counterAttack, id) {
	this.name = name;
	this.hp = hp;
	this.attack = attack;
	this.counterAttack = counterAttack;
	this.type = 'character';
	this.id = id;
	this.div = function() {
					return ('<div class="' +this.type+ '" id="'+ this.id +'" >' +this.name+ '<br>' +'<img src="assets/images/'+ this.id +'.jpg"></img><br>' +this.hp+ 'hp</div>');
				};
}

function refreshCharacters(){
	obiWan = new Character('Obi-Wan', 120, 8, 15, 'obi-wan'),
	luke 	= new Character('Luke Skywalker', 100, 14, 5, 'luke-skywalker'),
	maul	= new Character('Darth Maul', 150, 8, 20, 'darth-maul'),
	sidious	= new Character('Darth Sidious', 180, 7, 25, 'darth-sidious');
	availableCharacters = [obiWan, luke, maul, sidious];
}

function populateCharacters(section) {
	$('#character-select').empty();
	$(section).empty();
	for(var char of availableCharacters) {
		$(section).append(char.div());
	}
}

function populatePlayer(char, section) {
		$(section).empty();
		$(section).append(char.div());
		populateCharacters('#enemies');
}

function displayMessage(msg) {
	if( msg == 'clear') { $('#messages').html(''); }
	else{ $('#messages').append('<p>'+ msg + '</p>'); }
	
}

function gameEnd(char, section) {
	playerSelected = false;
	char.type = 'dead';
	populatePlayer(char, section);
	$('#messages').append('<button class="float-left" id="restart">Restart</button>');
}

function gameRestart() {
	playerSelected = false,
	enemySelected = false;
	attackMultiplier = 1
	availableCharacters = [obiWan, luke, maul, sidious];
	$('#enemies').empty();
	$('#defender').empty();
	$('#player').empty();
	displayMessage('clear');
	refreshCharacters();
	populateCharacters('#character-select');
}

$(document).on('click', '.character', function() {
	if(!playerSelected){
		playerSelected = true;
		var id = this.id;
		for(var char of availableCharacters) {
			if( char.id == id ) {
				var index = availableCharacters.indexOf(char);
				char.type = 'player';
				player = char;
			}
			else{
				char.type =  'enemy';
			}
		}

		if (index > -1){
			availableCharacters.splice(index, 1);
			populatePlayer(player, '#player');
		}

	}
});

$(document).on('click', '.enemy', function() {
	if(!enemySelected){
		enemySelected = true;
		var id = this.id;
		for(var char of availableCharacters) {
			if( char.id == id ) {
				var index = availableCharacters.indexOf(char);
				defender = char;
			}
		}
		if (index > -1){
			availableCharacters.splice(index, 1);
			populatePlayer(defender, '#defender');
			displayMessage('clear');
			displayMessage('Press button to attack ' + defender.name + '!');
		}			
	}
});

$(document).on('click', '#attack', function() {
	if(playerSelected && enemySelected) {
		displayMessage('clear');
		var damage = attackMultiplier * player.attack;
		attackMultiplier++;

		defender.hp = defender.hp - damage;
		populatePlayer(defender, '#defender');		
		displayMessage(player.name + ' attacks ' + defender.name + ' for ' + damage + ' damage.');

		if(defender.hp <= 0){
			enemySelected = false;
			$('#defender').empty();
			displayMessage('clear');
			displayMessage(defender.name + ' has been defeated!.');

			if(availableCharacters.length == 0){
				defender.hp = 0;
				displayMessage('You win!<br>')
				gameEnd(defender, '#defender');
			}
			else{
				displayMessage('Select your new opponent.');
			}
		}
		else{
			player.hp = player.hp - defender.counterAttack;
			populatePlayer(player, '#player');		
			displayMessage(defender.name + ' counter-attacks ' + player.name + ' for ' + defender.counterAttack + ' damage.');
			if(player.hp <= 0) {
				player.hp = 0;
				displayMessage('You lose!<br>');
				gameEnd(player, '#player');
			}
		}
	}
});

$(document).on('click', '#restart', function(){
	gameRestart();
} );



		





