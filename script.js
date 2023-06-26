const prompt = require('prompt-sync')({sigint: true});

let gameWon = false;
let gameLost = false;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor ( fieldArray ){ //fieldArray is a 2 dimensional array representing the board
        this._fieldArray = fieldArray;
        this.print();
        //player starts at position (0,0)
        this._playerRow = 0;
        this._playerColumn = 0;
    }

    get fieldArray(){
        return this._fieldArray;
    }

    get playerRow(){
        return this._playerRow;
    }

    get playerColumn(){
        return this._playerColumn;
    }

    //generates a 2D field array based on supplied height, width, percentHoles
    static generateField(height, width, percentHoles){
        
        const field = [];
        //populate the array with field characters
        for(let i = 0; i < height; i++){
            const fieldRow = [];
            for(let j = 0; j < width; j++){
                fieldRow.push('░');
            }
            field.push(fieldRow);
        }

        //make the top left most element an asterik to mark starting place
        field[0][0] = '*';

        let hatRow = 0;
        let hatColumn = 0;
        //make one of the other elements the hat (^) randomly
        while(hatRow === 0 && hatColumn === 0){ //keep going until we get indices not equal to (0,0)
            hatRow = Math.floor( Math.random() * height ); 
            hatColumn = Math.floor( Math.random() * width);
        }

        field[hatRow][hatColumn] = '^';

        //find out how many holes need to be dug based on area and percentHoles
        const area = height * width;
        let holesToDig = Math.ceil( area * (percentHoles * 0.01)); 

        //keep adding holes until numHoles has been reached
        while (holesToDig > 0){
            let holeRow = Math.floor( Math.random() * height); //index between 0 and height-1
            let holeColumn = Math.floor( Math.random() * width); //index between 0 and width-1

            //if element at location is a field character, put a hole there
            if (field[holeRow][holeColumn] === '░'){
                field[holeRow][holeColumn] = 'O';
                holesToDig--;
            } 

        }

        return field;


    }
    //prints a string representation of the board
    print(){
        for( const fieldRow of this._fieldArray ){
            console.log(fieldRow.join(''));
        }
    }

    //marks player position with an asterik
    markPlayerPosition(){
        this.fieldArray[this.playerRow][this.playerColumn] = '*';
    }

    //checks if player has moved off board
    playerOffBoard(){
        //check if player has moved too far up or down
        if (this.playerRow < 0 || this.playerRow > this.fieldArray.length ){
            console.log("You fell off the board!");
            return true;
        }
        //check if player has moved too far left or right
        if (this._playerColumn < 0 || this.playerColumn > this.fieldArray[0].length){
            console.log("You fell off the board!");
            return true;
        }

        return false;
    }

    //checks if a player has landed on a hole
    playerFellDown(){
        if (this.fieldArray[this.playerRow][this.playerColumn] === 'O'){
            console.log("You fell down a hole!");
            return true;
        } else {
            return false;
        }
    }

    //checks if a player has reached their hat
    playerReachedHat(){
        if (this.fieldArray[this.playerRow][this.playerColumn] === '^'){
            console.log("Congratulations, you found your hat!");
            return true;
        } else {
            return false;
        }
    }

    //randomly changes 5 field characters to holes and 2 holes to characters
    randomChangeField(){
        let numFieldToHoles = 5;
        let numHolesToField = 5;
        //change 5 field characters to holes
        while (numFieldToHoles > 0){
            let holeRow = Math.floor(Math.random() * this._fieldArray.length);
            let holeColumn = Math.floor(Math.random() * this._fieldArray[0].length);

            if(this._fieldArray[holeRow][holeColumn] === '░'){
                this._fieldArray[holeRow][holeColumn] = 'O';
                numFieldToHoles--;
            }
        }

        //change 5 Holes to field characters
        while (numHolesToField > 0){
            let fieldRow = Math.floor(Math.random() * this._fieldArray.length);
            let fieldColumn = Math.floor(Math.random() * this._fieldArray[0].length);

            if(this._fieldArray[fieldRow][fieldColumn] === 'O'){
                this._fieldArray[fieldRow][fieldColumn] = '░';
                numHolesToField--;
            } 
        }
    }

    //takes a direction and moves the player based on the directon
    move( direction ){
        //deletes current marker for player position
        this.fieldArray[this.playerRow][this.playerColumn] = fieldCharacter;
        direction = direction.toLowerCase();
        if ( direction === 'a'){ //move left
            this._playerColumn--;
        } else if ( direction === 'd'){ //move right
            this._playerColumn++;
        } else if ( direction === 'w'){ //move up
            this._playerRow--;
        } else if ( direction === 's'){ //move down
            this._playerRow++;
        } else {
            console.log('Please use WASD keys');
            return;
        }

        //check consequence of moving player
        if (this.playerOffBoard() || this.playerFellDown()){
            gameLost = true;
        } else if (this.playerReachedHat()){
            gameWon = true;
        } else { //mark player position and print the board
            this.markPlayerPosition();
            this.print();
            //randomly change holes and fieldCharacters
            this.randomChangeField();
        }



    }



};


console.log("=======================");
console.log("FIND YOUR HAT: The Game");
console.log("=======================");
console.log();
console.log("Oh no, where did your hat (^) go?");
console.log("Get to your hat using the following keys:");
console.log();
console.log("           (W)Up");
console.log("Left(A)    (S)Down     (D)Right ");
console.log();
console.log("Avoid falling down holes => (O)");
console.log("Holes move around, so watch out!");
console.log();
prompt("Press Enter begin the game: ");


//variable to store whether the player wants to continue the game
let continueGame = true;

while (continueGame === true) {
    //generate a new Field object with a field that is 12x24 with 25% holes
    const myField = new Field( Field.generateField(12, 24, 25 ) );

    //play the game while the game has not been won or lost
    while (gameWon === false && gameLost === false){
        let direction = prompt("Enter Next Move: ");
        myField.move(direction);
    }
    
    //reset game
    gameWon = false;
    gameLost = false;

    //ask the player if they want to play another round
    let answer = prompt("Continue Game? (y)es (n)o : ");
    answer = answer.toLowerCase();
    if (answer === 'n'){
        continueGame = false;
    }
}
