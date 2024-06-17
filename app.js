document.addEventListener("DOMContentLoaded", () => {
    const moves = document.getElementById("moves-count");
    const timeValue = document.getElementById("time");
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const gameContainer = document.querySelector(".game-container");
    const result = document.getElementById("result");
    const controls = document.querySelector(".controls-container");
    let cards;
    let interval;
    let firstCard = false;
    let secondCard = false;

    const items = [
        {name:"bee",image:"images/bee.png"},
        {name:"crocodile",image:"images/crocodile.png"},
        {name:"macaw",image:"images/macaw.png"},
        {name:"gorilla",image:"images/gorilla.png"},
        {name:"tiger",image:"images/tiger.png"},
        {name:"monkey",image:"images/monkey.png"},
        {name:"chameleon",image:"images/chameleon.png"},
        {name:"piranha",image:"images/piranha.png"},
        {name:"anaconda",image:"images/anaconda.png"},
        {name:"sloth",image:"images/sloth.png"},
        {name:"cockatoo",image:"images/cockatoo.png"},
        {name:"toucan",image:"images/toucan.png"}];

    // Initial time
    let seconds = 0 ;
    let minutes = 0;
    // Initial moves and count
    let moveCount = 0;
    let winCount = 0;

    // For timer
    const timeGenerator = () => {
        seconds += 1;
        // minutes logic
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        // Format time before displaying
        let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
        let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
        timeValue.innerHTML = `<span>Time:</span> ${minutesValue}:${secondsValue}`;
    };

    // For calculating moves
    const movesCounter = () => {
        moveCount += 1;
        moves.innerHTML = `<span>Moves:</span>${moveCount}`;
    };

    // Pick random objects from item array
    const generateRandom = (size = 4) => {
        // Temporary array
        let tempArray = [...items];
        // Initialize card value
        let cardValues = [];
        // Size should be double (4x4 matrix)/2 since 2 pairs of objects would exist
        size=(size*size)/2
        for (let i = 0; i < size; i++) {
            const randomIndex = Math.floor(Math.random() * tempArray.length);
            cardValues.push(tempArray[randomIndex]);
            // Once selected remove object
            tempArray.splice(randomIndex, 1);
        }
        return cardValues;
    };

    const matrixGenerator = (cardValues, size = 4) => {
        gameContainer.innerHTML = "";
        cardValues = [...cardValues, ...cardValues];
        // Simple shuffle
        cardValues.sort(() => Math.random() - 0.5);
        for (let i = 0; i < size * size; i++) {
            /*
            Create cards
            before => front side (contains question mark)
            after => back side (contains the actual image)
            data-card-values is a custom attribute that stores the names of the cards to match later
            */
            gameContainer.innerHTML += `
            <div class="card-container" data-card-value="${cardValues[i].name}">
                <div class="card-before">?</div>
                <div class="card-after">
                    <img src="${cardValues[i].image}" class="image"/>
                </div>
            </div>`;
        }
        //grid
        gameContainer.style.gridTemplateColumns=`repeat(${size},auto)`;
        //cards
        cards = document.querySelectorAll(".card-container")
        cards.forEach((card) => {
            card.addEventListener("click",()=>{
               //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
                if(!card.classList.contains("matched")){
                    //flip the card
                    card.classList.add("flipped");
                    //if firstcard (!firstcard since firstcard is always false)
                    if(!firstCard){
                        //so current card will become 1st card
                        firstCard = card;
                        //if currentcard becomes 1stcardvalue 
                        firstCardValue = card.getAttribute("data-card-value");
                 }
                 else{
                    //increment since user selected 2nd card
                    movesCounter();
                    //2nd card and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if(firstCardValue == secondCardValue){
                        // matched cards would be ignored
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");

                        firstCard=false;
                        //winCount increment
                        winCount += 1;
                        if(winCount == Math.floor(cardValues.length/2)){
                            result.innerHTML=`<h2>You Won</h2>
                            <h4>Moves:${moveCount}</h4>`;
                            stopGame();
                            
                        }
                    }else{
                        //if cards dont match flip it back to normal
                        let [tempFirst,tempSecond] = [firstCard,secondCard];
                        firstCard=false;
                        secondCard=false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
                }
               
            })
        });
    };

    //startgame
    startBtn.addEventListener("click",()=>{
        moveCount= 0;
        seconds=0;
        minutes=0;
        controls.classList.add("hide");
        stopBtn.classList.remove("hide");
        startBtn.classList.add("hide");
        interval = setInterval(timeGenerator,1000);
        moves.innerHTML=`<span>Moves:</span>${moveCount}`;
        initializer();
    })

    //stopgame
    stopBtn.addEventListener("click",(stopGame=()=>{
        controls.classList.remove("hide");
        stopBtn.classList.add("hide");
        startBtn.classList.remove("hide");
        clearInterval(interval);
    }))
    

    // Initialize values and function calls
    const initializer = () => {
        result.innerText = "";
        winCount = 0;
        let cardValues = generateRandom();
        console.log(cardValues);
        matrixGenerator(cardValues);
    }

});
