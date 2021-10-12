const alphabetContainer = document.querySelector(".alphabet");
const guessForm = document.querySelector(".guess-form");
const inputText = guessForm.querySelector("input[type='text']");
const attemptsTableBody = document.querySelector(".attempts__body");
const playAgainButtons = document.querySelectorAll(".play-again");
const winScreen = document.querySelector(".win-screen");
const giveUpButton = document.querySelector(".give-up");
const giveUpScreen = document.querySelector(".give-up-screen");
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let wordToGuess;

/**
 * Viene eseguita al caricamento della pagina e per resettare il gioco in caso
 * l'utente voglia fare un'altra partita.
 */
function init() {
  winScreen.setAttribute("hidden", "hidden"); // nascondiamo la schermata di vittoria
  giveUpScreen.setAttribute("hidden", "hidden");
  attemptsTableBody.innerHTML = "";
  // nascondiamo la schermata di give-up
  /**
   * Renderizza le lettere dell'alfabeto assegnandole alla proprietà innerHTML del
   * contenitore disponibile in pagina.
   * map() genera un array e join() unifica quell'array in una stringa (così si evita
   * di renderizzare anche delle virgole superflue).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
   */
  alphabetContainer.innerHTML = alphabet.map((letter) => `<div class="letter" data-state="0">${letter}</div>`).join("");
  /**
   * Siccome le lettere non sono disponibili nel DOM al caricamento della pagina, qui e soltanto qui
   * posso aggiungere un eventListener legato alle singole lettere. Così da poterne gestire lo stato.
   */
  const letters = document.querySelectorAll(".letter"); // Recupera tutti gli elementi con classe .letter
  letters.forEach((letter) => letter.addEventListener("click", manageLetterState)); // Aggiunge un eventListener per ogni lettera.
  // Recupero della parola nascosta.
  getWordToGuess();
  // Event Listener per bottoni e form
  guessForm.addEventListener("submit", handleSubmit);
  giveUpButton.addEventListener("click", handleGiveUp);
  playAgainButtons.forEach(button => button.addEventListener("click", init));
}

function handleGiveUp() {
  giveUpScreen.removeAttribute("hidden");
  const wordNotGuessedSpan = document.querySelector(".word-not-guessed");
  wordNotGuessedSpan.innerText = wordToGuess;
}

/**
 * Gestisce l'invio del form. Controllando se l'utente ha indovinato la parola nascosta
 * oppure no.
 *
 * @param {Event} e Informazioni sull'evento che si è verificato (invio del form)
 */
function handleSubmit(e) {
  e.preventDefault(); // Previene il refresh della pagina in seguito all'invio.

  const inputUtente = inputText.value.toLowerCase(); // Valore digitato dall'utente trasformato in sole lettere minuscole.

  // L'utente ha indovinato?
  if (inputUtente === wordToGuess) {
    userWin();
  } else {
    userTried(inputUtente);
  }

  e.target.reset(); // Resetta il form dopo ogni invio, risparmiando all'utente la necessità di cancellare quanto scritto in precedenza.
}

/**
 * Mostra la schermata di vittoria.
 */
function userWin() {
  winScreen.removeAttribute("hidden");
}

/**
 * Controlla quante lettere sono corrette in base all'input dell'utente e
 * mostra il conteggio in tabella.
 *
 * @param {String} inputUtente Parola inserita dall'utente.
 */
function userTried(inputUtente) {
  // Quante lettere sono corrette?
  const correctLettersCount = countCorrectLetters(inputUtente);
  // Mostra conteggio in tabella.
  attemptsTableBody.innerHTML += `
    <div class="attempt">
      <div class="words">${inputUtente}</div>
      <div class="counts">${correctLettersCount}</div>
    </div>
  `;
  attemptsTableBody.scrollTop = 0 - attemptsTableBody.scrollHeight;
  // TODO: Non funziona come dovrebbe. Risolvere
}

// Funzione per  lunghezza dell'input che deve essere di 5 caratteri.
function imputUtente() {
  if (imputUtente.length < 0 != 5) {
    return imputUtente
  }
}

imputUtente();


/**
 * Conta la lettere corrette presenti nella parola da indovinare.
 *
 * @param {String} inputUtente Parola digitata dall'utente
 * @returns {Number} Conteggio delle lettere corrette.
 */
function countCorrectLetters(inputUtente) {
  // Se le due parole sono anagrammi return immediato di 5.
  if (isAnagram(inputUtente, wordToGuess)) {
    return 5;
  }
  // Trasformare la stringa inputUtente in array
  const arrayInputUtente = deleteDuplicates(inputUtente.split("")); // Elimino i duplicati perché sballerebbero il conteggio.
  // Trasformare la parola da indovinare in array
  const arrayWordToGuess = wordToGuess.split("");
  // Inizializzare un conteggio che conterà le ricorrenze.
  let count = 0;
  arrayWordToGuess.forEach(userLetter => { // Loop sulla parola più lunga
    if (arrayInputUtente.indexOf(userLetter) !== -1) {
      count++;
    }
  });
  return (count >= 5) ? count - 1 : count;

  // Essendo 5 l'unica casistica non affrontabile a questo punto (perché avremmo già vinto altrimenti o le due parole sono anagrammi), se il conteggio risulta maggiore uguale a 5, significa che ci sono delle doppie che vengono calcolate e quindi ha senso sottrarre 1.
}



/**
 * Confrontare due parole e determina se sono anagrammi.
 *
 * @param {String} word1 Prima parola da confrontare
 * @param {String} word2 Seconda parola da confrontare
 * @returns {Boolean}
 */
function isAnagram(word1, word2) {
  word1 = word1.split("").sort().join(""); // split() genera array sort() ordina lettere in ordine alfabetico join() unisce array e restituisce stringa.
  word2 = word2.split("").sort().join("");

  return word1 === word2;
}


/**
 * Restituisce un nuovo array escludendo le lettere duplicate.
 *
 * @param {Array} list Lista di lettere alla quale rimuovere i duplicati
 * @returns {Array}
 */
function deleteDuplicates(list) {
  const duplicates = [];
  list.forEach(element => {
    if (!duplicates.includes(element)) {
      duplicates.push(element);
    }
  });

  return duplicates;
}

/**
 * Recupera una parola dalla lista di parole presenti nel documento words.txt
 * presente nella cartella assets. La parola verrà quindi assegnata alla variabile
 * wordToGuess.
 */
function getWordToGuess() {
  // Mando una richiesta per recuperare il file words.txt
  fetch('http://127.0.0.1:5500/assets/words/words.txt')
    .then(resource => resource.text()) // Trasformo il body della richiesta HTTP in testo
    .then(text => {
      const wordsList = text.split("\n"); // Dal testo che ho ottenuto creo un array con tutte le parole. \n è il carattere che indica "a capo".
      const index = getRandomNumber(0, wordsList.length - 1); // Indice dell'elemento della lista da parola da selezionare. wordsList.length - 1 perché length conta da 1, mentre gli indici partono da 0.
      wordToGuess = wordsList[index];
      console.log(wordToGuess);
    });
}

/**
 * Genera un numero randomico compreso tra un numero minimo ed un numero
 * massimo.
 *
 * @param {Number} min Numero minimo potenzialmente estraibile
 * @param {Number} max Numero massimo potenzialmente estraibili
 * @returns {Number} Numero randomico compreso e includendo gli estremi minimi e massimi
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Gestisce lo stato delle lettere, cambiandone l'attributo data-state.
 *
 * Reference dei vari stati:
 * - 0: rest (lettera nel suo stato standard)
 * - 1: error (lettera esclusa dall'utente)
 * - 2: maybe (lettera in forse per l'utente)
 * - 3: ok (lettera potenzialmente corretta scelta dall'utente)
 *
 * @param {Event} e Informazioni relative all'evento che è stato emesso.
 */
function manageLetterState(e) {

  let letterState = parseInt(e.target.dataset.state); // Trasformo la stringa dell'attributo in numero per poter fare le operazioni successive.

  if (letterState < 3) {
    letterState++;
  } else {
    letterState = 0;
  }

  e.target.dataset.state = letterState  // Cambierà il valore dell'attributo data-state in base al valore precedente.

}

init(); // Viene eseguita al caricamento della pagina ed inizializza il gioco.
