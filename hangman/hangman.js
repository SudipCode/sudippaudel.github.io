let wordList = ['javascript', 'hangman', 'code', 'game'];
let word = wordList[Math.floor(Math.random() * wordList.length)];
let guessedWord = [];
let guesses = 10;

for (let i = 0; i < word.length; i++) {
  guessedWord[i] = '_';
}

while (guesses > 0) {
  console.log(guessedWord.join(' '));
  let guess = prompt(`Guess a letter or click "Cancel" to quit. You have ${guesses} guesses left.`);
  
  if (guess === null) {
    console.log('Thanks for playing!');
    break;
  } else if (guess.length!== 1) {
    alert('Please input only one letter.');
  } else {
    let isGuessed = false;
    for (let i = 0; i < word.length; i++) {
      if (word[i] === guess) {
        guessedWord[i] = guess;
        isGuessed = true;
      }
    }
    if (!isGuessed) {
      guesses--;
      alert(`Wrong guess! You have ${guesses} guesses left.`);
    }
  }