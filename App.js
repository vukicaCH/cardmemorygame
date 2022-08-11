import './App.css';
import React from 'react';

let numbers = [
  1,2,3,4,5,1,2,3,4,5
].sort(() => .5 - Math.random());

function pickACard(num){
  switch(num){
    case 1:
      return 'ace';
    case 2:
      return 'ten';
    case 3:
      return 'j';
    case 4:
      return 'queen';
    case 5:
      return 'king';
  }
}

let gameState = [];

for(let number of numbers){
  gameState.push({number: number, isFlipped: false, isGuessed: false});
}

function checkGame(arr){
  let count = 0;

  for(let item of arr){
    if(item.isFlipped){
      count++;
    }
  }

  if(count == 2){
    return true;
  }

  return false;
}

function isGameOver(arr){
  let num = arr.length;
  let count = 0;

  for(let item of arr){
    if(item.isGuessed){
      count++;
    }
  }

  if(num === count){
    return true;
  }else{
    return false;
  }
}

const Card = ({number, flipped, isGuessed, flipHandler, index}) => {

  let class_name = 'card' + (flipped ? ` disabled ${pickACard(number)} ` : '') + (isGuessed ? ' guessed' : '');

  return(
    <div
      className={class_name}
      data-index={index}
      onClick={flipHandler}
    >
      
    </div>
  )
}

const Reset = ({resetHandler}) => {
  return(
    <button onClick={resetHandler}>Reset game?</button>
  )
}

const Game = () => {
  const [cardState, setCardState] = React.useState({gameState, isClickable: true, isFinished: false, numOfTurns: 0});

  function handleClick(e){
    let newGameState = cardState.gameState.map((card, index) => {
      if(index === +e.target.dataset.index){
        return {...card, isFlipped: !card.isFlipped};
      }

      return {...card};
    })

   setCardState({...cardState, gameState: newGameState, isClickable : checkGame(newGameState) ? false : true});
  }

  function handleReset(){
    setCardState({gameState, isClickable: true, isFinished: false, numOfTurns: 0})
  }

  React.useEffect(()=>{
    if(checkGame(cardState.gameState) || isGameOver(cardState.gameState)){
      let gameIsFinished = isGameOver(cardState.gameState) ? true : false;
      if(gameIsFinished){
        setCardState({...cardState, isFinished: gameIsFinished});
        return;
      }
      setTimeout(()=>{
        let flippedCards = cardState.gameState.filter(card => card.isFlipped);
        if(flippedCards[0].number === flippedCards[1].number){
            const newGameState = cardState.gameState.map(card => {
              if(card.number === flippedCards[0].number){
                return {number: card.number, isFlipped: false, isGuessed: true}
              }else{
                return card;
              }
            })
            console.log(newGameState);
            setCardState({
                ...cardState,
                gameState: newGameState,
                isClickable: true,
                numOfTurns: cardState.numOfTurns + 1,
                isFinished: gameIsFinished
              })
        }else{
          const newGameState = cardState.gameState.map(card => {
            return {...card, isFlipped: false};
          })
          console.log(newGameState);
            setCardState(cardState => {
              return {
                ...cardState,
                gameState: newGameState,
                isClickable: true,
                numOfTurns: cardState.numOfTurns + 1,
                isFinished: gameIsFinished
              }
            })
        }
      }, 1000);
    }

  }, [cardState.gameState, cardState.isFinished]);


  let cards = cardState.gameState.map((card, index) =>{
    return (
    <Card
      number={card.number}
      flipHandler={cardState.isClickable ? handleClick : function(){return false;}}
      flipped={card.isFlipped}
      isGuessed={card.isGuessed}
      index={index}
    />
    )
  })

  return(
    <>
    <h1 className='game-name'>CARD MEMORY GAME</h1>
        {cardState.isFinished ?
        <div className='end-of-game'>
          <Reset resetHandler={handleReset} />
          <h1>YOU FINISHED THE GAME IN {cardState.numOfTurns} TURNS</h1>
        </div>
        :
        cards
        }
    </>
  )

  
}

function App() {

  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
