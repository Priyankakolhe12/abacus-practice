let questions = [];
let currentQuestion = 0;
let score = 0;
let attempted = 0;
let correct = 0;
let wrong = 0;
let timer;
let timeLeft = 180;
window.onload = function () {
  // Check if already authenticated
  if (localStorage.getItem("accessGranted") === "true") {
    startQuiz();
  }
};

function checkPassword() {
  const password = document.getElementById("password-input").value;
  const correctPassword = "123"; // Set your actual password

  if (password === correctPassword) {
    localStorage.setItem("accessGranted", "true"); // Store access flag
    document.getElementById("error-message").style.display = "none";
    startQuiz();
  } else {
    document.getElementById("error-message").style.display = "block";
  }
}


function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1; // 1 to 6 only
}

function getRandomOperator() {
  return Math.random() > 0.5 ? '+' : '-';
}

function generateQuestion(numCount = 4) {
  const nums = Array.from({ length: numCount }, () => getRandomNumber());
  const ops = Array.from({ length: numCount - 1 }, () => getRandomOperator());

  let expressionParts = [];
  let temp = nums[0];
  expressionParts.push(temp);

  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === '-' && temp < nums[i + 1]) {
      return generateQuestion(numCount); // no negative intermediate
    }

    temp = eval(`${temp}${ops[i]}${nums[i + 1]}`);
    if (temp < 0 || !Number.isInteger(temp)) {
      return generateQuestion(numCount);
    }

    expressionParts.push(ops[i]);
    expressionParts.push(nums[i + 1]);
  }

  const expression = expressionParts.join('');
  const answer = eval(expression);

  if (answer > 25 || !Number.isInteger(answer)) {
    return generateQuestion(numCount); // skip if too hard
  }

  let options = new Set();
  options.add(answer);

  while (options.size < 4) {
    let offset = Math.floor(Math.random() * 5) + 1;
    let fakeOption = Math.random() > 0.5 ? answer + offset : answer - offset;
    if (fakeOption >= 0 && fakeOption <= 25 && !options.has(fakeOption)) {
      options.add(fakeOption);
    }
  }

  return {
    numbers: nums,
    operators: ops,
    correctAnswer: answer,
    options: shuffleArray(Array.from(options))
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
  document.getElementById("num3").innerText = q.numbers.length >= 3 ? `${q.operators[1]} ${q.numbers[2]}` : '';
  document.getElementById("num4").innerText = q.numbers.length === 4 ? `${q.operators[2]} ${q.numbers[3]}` : '';

  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`option${i}`);
    btn.innerText = q.options[i];
    btn.setAttribute("data-value", q.options[i]);
    btn.style.backgroundColor = "transparent";
    btn.style.color = "white";
    btn.disabled = false;
  }
}

function selectAnswer(btn) {
  const selected = Number(btn.getAttribute("data-value"));
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
    showResult();
  } else {
    loadQuestion();
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

  // First 50: 4-number questions
  for (let i = 0; i < 50; i++) {
    questions.push(generateQuestion(4));
  }

  // Next 50: 3-number questions
  for (let i = 0; i < 50; i++) {
    questions.push(generateQuestion(3));
  }

  document.getElementById("quiz-section").classList.remove("hidden");
  document.getElementById("start-section").classList.add("hidden");
  document.getElementById("result-section").classList.add("hidden");

  loadQuestion();
  startTimer();
}

function showResult() {
  clearInterval(timer);
  document.getElementById("quiz-section").classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");

  let message = "";
  if (score >= 90) {
    message = "Excellent!";
  } else if (score >= 70) {
    message = "Good!";
  } else {
    message = "Need More Practice!";
  }

  document.getElementById("feedback").innerText = message;
  document.getElementById("attempted").innerText = attempted;
  document.getElementById("correct").innerText = correct;
  document.getElementById("wrong").innerText = wrong;
  document.getElementById("score").innerText = score;
}

function restartQuiz() {
  document.getElementById("result-section").classList.add("hidden");
  document.getElementById("start-section").classList.remove("hidden");
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

function showQuiz() {
  startQuiz();
}
