let questions = [];
let currentQuestion = 0;
let score = 0;
let attempted = 0;
let correct = 0;
let wrong = 0;
let timer;
let timeLeft = 180; // 3 minutes

function getRandomNumber() {
  return Math.floor(Math.random() * 9) + 1; // 1 to 9
}

function getRandomOperator() {
  return Math.random() > 0.5 ? '+' : '-';
}

function generateQuestion() {
  const nums = [getRandomNumber(), getRandomNumber(), getRandomNumber(), getRandomNumber()];
  const ops = [getRandomOperator(), getRandomOperator(), getRandomOperator()];

  // Create the expression: num1 op1 num2 op2 num3 op3 num4
  let expression = `${nums[0]}${ops[0]}${nums[1]}${ops[1]}${nums[2]}${ops[2]}${nums[3]}`;

  let answer = eval(expression);

  // Avoid negative or decimal answers
  if (answer < 0 || !Number.isInteger(answer)) {
    return generateQuestion();
  }

  let options = [answer];
  while (options.length < 4) {
    let option = answer + Math.floor(Math.random() * 11) - 5; // +/- 5
    if (option >= 0 && !options.includes(option)) {
      options.push(option);
    }
  }

  options = shuffleArray(options); // Randomize order

  return {
    numbers: nums,
    operators: ops,
    correctAnswer: answer,
    options: options,
  };
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  if (currentQuestion >= 100) {
    showResult();
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("question-number").innerText = `Question: ${currentQuestion + 1}`;

  document.getElementById("num1").innerText = q.numbers[0];
  document.getElementById("num2").innerText = `${q.operators[0]} ${q.numbers[1]}`;
  document.getElementById("num3").innerText = `${q.operators[1]} ${q.numbers[2]}`;
  document.getElementById("num4").innerText = `${q.operators[2]} ${q.numbers[3]}`;

  const optionButtons = document.getElementsByClassName("option-btn");
  for (let i = 0; i < 4; i++) {
    optionButtons[i].innerText = q.options[i];
  }
}

function selectAnswer(btn) {
  const selected = Number(btn.innerText);
  const q = questions[currentQuestion];

  attempted++;
  if (selected === q.correctAnswer) {
    score++;
    correct++;
  } else {
    wrong++;
  }

  currentQuestion++;

  if (currentQuestion >= 100 || timeLeft <= 0) {
    showResult();  // show final result after 100th answer
  } else {
    loadQuestion(); // load next one
  }
}


function startQuiz() {
  questions = [];
  currentQuestion = 0;
  score = 0;
  attempted = 0;
  correct = 0;
  wrong = 0;
  timeLeft = 180;

  for (let i = 0; i < 100; i++) {
    questions.push(generateQuestion());
  }

  document.getElementById("quiz-section").classList.remove("hidden");
  document.getElementById("result-section").classList.add("hidden");

  loadQuestion();
  startTimer();
}

function showResult() {
  clearInterval(timer);
  document.getElementById("quiz-section").classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");

  document.getElementById("attempted").innerText = attempted;
  document.getElementById("correct").innerText = correct;
  document.getElementById("wrong").innerText = wrong;
  document.getElementById("score").innerText = score;
}

function restartQuiz() {
  startQuiz();
}

function startTimer() {
  document.getElementById("timer").innerText = formatTime(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Start quiz on page load
window.onload = startQuiz;
