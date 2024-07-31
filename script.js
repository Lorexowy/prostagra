document.getElementById('startButton').addEventListener('click', startGame);

let timeLeft = 600; // 10 minutes in seconds
let currentPuzzle = 0;
let countdown;
let hintsRemaining = 3; // Liczba dostępnych podpowiedzi
let wrongAnswerStreak = 0; // Licznik złych odpowiedzi
let score = 0;
let visitTimer; // Timer odwiedzin
let directionErrors = 0; // Licznik błędnych kierunków
const maxDirectionErrors = 5; // Maksymalna liczba błędnych kierunków
const phoneDigits = "792230524";
const correctAddress = "Adama Krzyżanowskiego 17"; // Przykładowy poprawny adres
const puzzles = [
    "Jaki jest ulubiony kolor Saschy?",
    "Jaki jest numer rejestracji BWM Saschy?",
    "W którym roku Sascha uzyskał wyższe wykształcenie?",
    "Jaki jest max Saschy na płaskiej na jednego repa?",
    "Jakie imię zostało nadane Saschy po narodzinach?",
    "Ile kont obserwuje Sascha na instagramie?",
    "Imię najstarszego psa Saschy?",
    "W którym roku Sascha założył facebooka?",
    "Jak ma na drugie imię Sascha?"
];
const answers = ["niebieski", "kr4k783", "2022", "120", "aleksander", "432", "wirus", "2014", "jerzy"];
const hints = [
    "Piękny jak kolor nieba",
    "Może powinieneś poszukać w galerii zdjęcia...",
    "Ukończył studia I stopnia na kierunku Zarządzanie.",
    "Więcej niż 100 jakimś cudem.",
    "Tęsknię.",
    "Po prostu sprawdź.",
    "Bakteria.",
    "Miał ukończone 14 lat.",
    "Jak jego wielki stary (wielki bo jest wielkim człowiekiem)"
];
const choices = ["Bartek Ziomber", "Mateusz Michel", "Mateusz Banyś", "Mateusz Wrona"];
const directions = ["Prosto", "W lewo", "Po schodach do góry", "W lewo", "W lewo"];
const allDirections = ["Prosto", "W lewo", "Po schodach do góry", "W prawo", "Po schodach w dół"];
let directionIndex = 0;
const correctPin = "5197";
const correctUsername = "Asaszaj";
const correctPassword = "Azir69";
const correctCode = "784031234";
const correctVintedUsername = "ansax";
const correctStreets = ["Tytusa Chałubińskiego", "Szybisko", "Myślenicka", "Zbigniewa Herberta", "Jerzego Turowicza", "aleja Powstańców Śląskich", "Wielicka"];
const loginHints = [
    "Poczekaj a podpowiedzi same spadną z nieba...",
    "Jego hasło napewno nie może być skomplikowane...Pewnie to coś co dobrze kojarzy mu się z tą grą..",
    "Mam dziwne przeczucie, że jego hasło ma mniej niż 7 znaków... Przecież to debil...",
    "Nie sądze też  żeby miał miał tam znaki specjalne... Prawdopodobnie to jakieś słowo i liczba",
    "Ciekawe czy Sascha lubi papugi...",
    "Nigdy go nie zapytałem jaki jest jego ulubiony ptak...Kiedy to wszystko się skończy muszę go koniecznie zapytać",
    "On naprawdę długo już gra w tą grę.. ciekawe na kim ma największy poziom mastery...",
    "oraz jaki to poziom...",
    "Z dużej litery zjebie"
];
let loginHintIndex = 0;
let loginHintInterval;
let currentStreetIndex = 0;

// Dodaj dźwięki
const correctSound = new Audio('correct.mp3');
const wrongSound = new Audio('wrong.mp3');
const endSound = new Audio('end.mp3');
const dialingSound = new Audio('dialing.mp3'); // Dodaj dźwięk wybierania numeru
const backgroundMusic = new Audio('background-music.mp3'); // Dodaj cichą muzykę w tle

function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('story').style.display = 'none';
    document.getElementById('hintButton').style.display = 'inline';
    startTimer();
    showPuzzle();
    backgroundMusic.loop = true; // Ustawienie odtwarzania w pętli
    backgroundMusic.volume = 0.2; // Ustawienie głośności
    backgroundMusic.play(); // Odtworzenie muzyki
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame(false);
            return;
        }
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Time left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

function showPuzzle() {
    if (currentPuzzle >= puzzles.length) {
        stopTimerAndHideElements();
        makePhoneCall();
        return;
    }
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = `
        <div class="puzzle">
            <p>${puzzles[currentPuzzle]}</p>
            <input type="text" id="answerInput" placeholder="Your answer">
            <button onclick="checkAnswer()">Submit</button>
        </div>
    `;
    document.querySelector('.puzzle').style.display = 'block';
    document.getElementById('hint').textContent = ''; // Resetuj podpowiedź
}

function checkAnswer() {
    const userAnswer = document.getElementById('answerInput').value.toLowerCase();
    if (userAnswer === answers[currentPuzzle]) {
        updatePhoneNumber(currentPuzzle);
        updateScore();
        currentPuzzle++;
        wrongAnswerStreak = 0; // Resetowanie licznika złych odpowiedzi
        correctSound.play();
        showNotification('Correct answer!', 'success');
        showPuzzle();
    } else {
        wrongAnswerStreak++;
        let penalty = 10 + (wrongAnswerStreak - 1) * 5;
        timeLeft -= penalty;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(countdown);
            endGame(false);
        }
        wrongSound.play();
        showNotification(`Wrong answer. You lost ${penalty} seconds. Try again!`, 'error');
    }
}

function updatePhoneNumber(puzzleIndex) {
    const phoneNumberElement = document.getElementById('phone-number');
    let currentDisplay = phoneNumberElement.textContent.split(" ");
    currentDisplay[puzzleIndex] = phoneDigits[puzzleIndex];
    phoneNumberElement.innerHTML = currentDisplay.map(digit => `<span>${digit}</span>`).join(" ");
}

function showHint() {
    if (hintsRemaining > 0) {
        document.getElementById('hint').textContent = hints[currentPuzzle];
        hintsRemaining--;
    } else {
        document.getElementById('hint').textContent = 'No hints remaining!';
    }
}

function updateScore() {
    const timeBonus = Math.floor(timeLeft / 10);
    score += 100 + timeBonus;
    document.getElementById('score').textContent = `Score: ${score}`;
}

function endGame(success) {
    clearInterval(countdown);
    clearInterval(loginHintInterval); // Zatrzymanie interwału podpowiedzi
    hideAllSections();
    const puzzleContainer = document.getElementById('puzzle-container');
    const message = success 
        ? "Brawo! Gra ukończona!"
        : "Koniec czasu! Sascha wypił piwo i złamał zasady!";
    
    puzzleContainer.innerHTML = `
        <div class="end-message">
            <p>${message}</p>
            <button onclick="location.reload()">Play Again</button>
        </div>
    `;
    puzzleContainer.style.display = 'block';
    document.getElementById('timer').textContent = '';
    document.getElementById('hintButton').style.display = 'none';
    endSound.play();
    backgroundMusic.pause(); // Zatrzymanie muzyki
    showNotification(message, success ? 'success' : 'error');
}

function showNotification(message, type) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 3000);
}

function makePhoneCall() {
    hideAllSections();
    document.getElementById('loading').style.display = 'block';
    dialingSound.play(); // Odtwórz dźwięk wybierania numeru
    setTimeout(() => {
        dialingSound.pause(); // Zatrzymaj dźwięk wybierania numeru
        document.getElementById('loading').style.display = 'none';
        document.getElementById('phone-call').style.display = 'block';
        showNotification("Sascha nie odbiera, muszę do niego pojechać...", 'error');
    }, 5000); // Czekaj 5 sekund, zanim pokaże się komunikat
}

function visitSascha() {
    hideAllSections();
    document.getElementById('visit-sascha').style.display = 'block';
    startVisitTimer();
}

function startVisitTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('visit-timer');
    visitTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(visitTimer);
            endGame(false);
            return;
        }
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}`;
    }, 1000);
}

function checkAddress() {
    const addressInput = document.getElementById('addressInput').value.toLowerCase();
    if (addressInput === correctAddress.toLowerCase()) {
        clearInterval(visitTimer);
        clearInterval(countdown); // Usunięcie 10-minutowego timera
        hideAllSections();
        showResult("Dojechałeś do Saschy i zadzwoniłeś domofonem... Odebrał brat Saschy i zapytał kto tam. Przedstawiłeś się jako 'Event'. Na co Maks odpowiedział: aaa okej ty jesteś...");
        showChoices();
    } else {
        showNotification("Incorrect address. Try again!", 'error');
    }
}

function showResult(message) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = message;
    resultElement.style.display = 'block';
}

function showChoices() {
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = `
        <p>Kim jesteś?</p>
        ${choices.map((choice, index) => `<button onclick="checkIdentity(${index})">${choice}</button>`).join('')}
    `;
    choicesContainer.style.display = 'block';
}

function checkIdentity(index) {
    if (choices[index] === "Mateusz Wrona") {
        hideAllSections();
        showResult("Dobra to idź do pokoju do Saschy pewnie tam siedzi");
        showDirections();
    } else {
        endGame(false);
    }
}

function showDirections() {
    directionIndex = 0;
    directionErrors = 0; // Resetowanie liczby błędnych kierunków
    hideAllSections();
    showNextDirection();
}

function showNextDirection() {
    if (directionIndex >= directions.length) {
        showPinStage(); // Pokaż etap wpisywania kodu PIN
        return;
    }
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = `
        <p>Dostań się do pokoju Saschy od drzwi wejściowych:</p>
        <p>(kierunek wybieraj po kolei, zaczynasz od drzwi wejściowych patrząc w przeciwną stronę od drzwi. Możesz pomylić się 5 razy.)</p>
        ${allDirections.map((direction, index) => `<button onclick="checkDirection(${index})">${direction}</button>`).join('')}
    `;
    choicesContainer.style.display = 'block';
}

function checkDirection(index) {
    if (directions[directionIndex] === allDirections[index]) {
        directionIndex++;
        showNotification("Correct direction!", 'success');
        showNextDirection();
    } else {
        directionErrors++;
        if (directionErrors >= maxDirectionErrors) {
            endGame(false);
        } else {
            showNotification(`Wrong direction. You have ${maxDirectionErrors - directionErrors} attempts left.`, 'error');
        }
    }
}

function showPinStage() {
    hideAllSections();
    document.getElementById('pin-stage').style.display = 'block';
}

function checkPin() {
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const answer4 = document.getElementById('answer4').value;
    const pinInput = answer1 + answer2 + answer3 + answer4;
    const loadingBar = document.getElementById('loadingBar');

    loadingBar.style.display = 'block';
    loadingBar.innerHTML = '<div class="loading-bar-inner"></div>';

    setTimeout(() => {
        loadingBar.style.display = 'none';
        if (pinInput === correctPin) {
            showNarration(); // Przejdź do narracji po odblokowaniu komputera
        } else {
            showNotification("Incorrect PIN. Try again!", 'error');
        }
    }, 4000); // Czekaj 4 sekundy, zanim pokaże się wynik
}

function showNarration() {
    hideAllSections();
    const narrationElement = document.getElementById('narration');
    narrationElement.style.display = 'block';
    setTimeout(() => {
        narrationElement.style.display = 'none';
        showLoginStage(); // Przejdź do etapu logowania po narracji
    }, 8000); // Pokaż narrację przez 6 sekund
}

function showLoginStage() {
    hideAllSections();
    document.getElementById('login-stage').style.display = 'block';
    startLoginHints();
}

function checkLogin() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    if (username === correctUsername && password === correctPassword) {
        showNewNarration(); // Przejdź do nowej narracji po poprawnym zalogowaniu
    } else {
        showNotification("Incorrect username or password. Try again!", 'error');
    }
}

function showHintMessage() {
    const hintElement = document.getElementById('login-hint');
    hintElement.textContent = loginHints[0];
}

function startLoginHints() {
    loginHintIndex = 1;
    loginHintInterval = setInterval(() => {
        if (loginHintIndex < loginHints.length) {
            addLoginHint(loginHints[loginHintIndex]);
            loginHintIndex++;
        } else {
            clearInterval(loginHintInterval);
        }
    }, 45000); // Pokazuj podpowiedzi co 60 sekund
}

function addLoginHint(hint) {
    const hintList = document.getElementById('hint-list');
    const hintItem = document.createElement('p');
    hintItem.textContent = hint;
    hintList.appendChild(hintItem);
}

function showNewNarration() {
    hideAllSections();
    const newNarrationElement = document.getElementById('new-narration');
    newNarrationElement.style.display = 'block';
    setTimeout(() => {
        newNarrationElement.style.display = 'none';
        showCodeStage(); // Przejdź do etapu wpisywania kodu po narracji
    }, 6000); // Pokaż narrację przez 6 sekund
}

function showCodeStage() {
    hideAllSections();
    document.getElementById('code-stage').style.display = 'block';
}

function checkCode() {
    const code = document.getElementById('codeInput').value;
    if (code === correctCode) {
        showFinalNarration(); // Przejdź do kolejnej narracji po poprawnym wpisaniu kodu
    } else {
        showNotification("Incorrect code. Try again!", 'error');
    }
}

function showFinalNarration() {
    hideAllSections();
    const finalNarrationElement = document.getElementById('final-narration');
    finalNarrationElement.style.display = 'block';
    setTimeout(() => {
        finalNarrationElement.style.display = 'none';
        showVintedNarration(); // Przejdź do kolejnej narracji po 12 sekundach
    }, 12000); // Pokaż narrację przez 12 sekund
}

function showVintedNarration() {
    hideAllSections();
    const vintedNarrationElement = document.getElementById('vinted-narration');
    vintedNarrationElement.style.display = 'block';
    setTimeout(() => {
        vintedNarrationElement.style.display = 'none';
        showVintedStage(); // Przejdź do etapu wpisywania nicku Vinted
    }, 6000); // Pokaż narrację przez 6 sekund
}

function showVintedStage() {
    hideAllSections();
    document.getElementById('vinted-stage').style.display = 'block';
}

function checkVinted() {
    const vintedUsername = document.getElementById('vintedInput').value;
    if (vintedUsername === correctVintedUsername) {
        showMessages(); // Przejdź do kolejnych wiadomości po poprawnym wpisaniu nicku
    } else {
        showNotification("Incorrect username. Try again!", 'error');
    }
}

function showMessages() {
    hideAllSections();
    const messages = [
        "-Hej Ania, nie wiesz może gdzie jest Michał? Muszę się z nim koniecznie szybko skontaktować",
        "-Nie wysyłam zdjęć w ubraniach w prywatnej wiadomości",
        "-Nie nie, Ania to poważna sprawa, gdzie jest Michał koniecznie musze się z nim zobaczyć. To ja, Event, studiuje z Saschą na fryczu jestem najlepszym prawnikiem na tej uczelni",
        "-Aaa okej kojarze Cię, no Michał skończył grać jakiś czas temu i pojechali razem z Saschą do Kuby",
        "-Dobra dzięki bardzo!"
    ];
    const messageElements = messages.map((msg, i) => document.getElementById(`message${i + 1}`));
    let messageIndex = 0;

    function showNextMessage() {
        if (messageIndex < messages.length) {
            messageElements[messageIndex].textContent = messages[messageIndex];
            messageIndex++;
            setTimeout(showNextMessage, 5000);
        } else {
            setTimeout(() => {
                hideAllSections();
                showStreetStage();
            }, 10000);
        }
    }

    document.getElementById('message-stage').style.display = 'block';
    showNextMessage();
}

function showStreetStage() {
    hideAllSections();
    document.getElementById('street-stage').style.display = 'block';
}

function checkStreet() {
    const streetInput = document.getElementById('streetInput').value;
    const streetList = document.getElementById('streetList');

    if (streetInput === correctStreets[currentStreetIndex]) {
        const streetElement = document.createElement('p');
        streetElement.textContent = streetInput;
        streetList.appendChild(streetElement);
        currentStreetIndex++;
        document.getElementById('streetInput').value = '';

        if (currentStreetIndex >= correctStreets.length) {
            showFinalStage(); // Przejdź do ostatniego etapu gry
        }
    } else {
        showNotification("Zła ulica. Da się szybciej..", 'error');
    }
}

function showFinalStage() {
    hideAllSections();
    const finalStageElement = document.getElementById('final-stage');
    finalStageElement.style.display = 'block';
}

function saveSascha() {
    showEndingMessage("-1000000 AURA DLA KUMPLA", "red", "Nie pozwoliłeś kumplowi napić się pysznego piwerka... Nie ważne, że nie ma 18 lat, nie ważne czy będzie zaraz prowadził, nie ważne czy pójdzie do kasyna... najważniejsze, że kumplowi zimnego piwerka nie odmawiasz....");
}

function letHimDrink() {
    showEndingMessage("+101241567247 AURA DLA KUMPLA", "green", "Super, że mimo wszystko pozwoliłeś swojemu kumplowi cieszyć się swoim zimnym piwerkiem. Jesteś gość.");
}

function showEndingMessage(title, color, message) {
    hideAllSections();
    const endingMessageElement = document.getElementById('ending-message');
    endingMessageElement.innerHTML = `<h2 style="color: ${color};">${title}</h2><p>${message}</p>`;
    endingMessageElement.style.display = 'block';

    setTimeout(() => {
        endingMessageElement.style.opacity = 1;
        setTimeout(() => {
            endingMessageElement.style.opacity = 0;
            setTimeout(() => {
                endGame(true); // Zakończ grę sukcesem
            }, 1000);
        }, 30000); // Pokaż wiadomość przez 30 sekund
    }, 0);
}

function hideAllSections() {
    document.getElementById('puzzle-container').style.display = 'none';
    document.getElementById('phone-number').style.display = 'none';
    document.getElementById('visit-sascha').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('phone-call').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('choices').style.display = 'none';
    document.getElementById('pin-stage').style.display = 'none';
    document.getElementById('narration').style.display = 'none';
    document.getElementById('login-stage').style.display = 'none';
    document.getElementById('new-narration').style.display = 'none';
    document.getElementById('code-stage').style.display = 'none';
    document.getElementById('final-narration').style.display = 'none';
    document.getElementById('vinted-narration').style.display = 'none';
    document.getElementById('vinted-stage').style.display = 'none';
    document.getElementById('message-stage').style.display = 'none';
    document.getElementById('street-stage').style.display = 'none';
    document.getElementById('final-stage').style.display = 'none';
    document.getElementById('ending-message').style.display = 'none';
}

function stopTimerAndHideElements() {
    clearInterval(countdown);
    document.getElementById('timer').style.display = 'none';
    document.getElementById('hintButton').style.display = 'none';
}

function setVolume(volume) {
    backgroundMusic.volume = volume;
}

function toggleMute() {
    const muteButton = document.querySelector('.volume-controls button');
    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        muteButton.classList.remove('muted');
    } else {
        backgroundMusic.muted = true;
        muteButton.classList.add('muted');
    }
}
