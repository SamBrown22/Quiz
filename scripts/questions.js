// Retrieve data from session storage
const dataJson = JSON.parse(sessionStorage.getItem('questions'));
const questionDiv = document.getElementById('questionDiv');

let currentQuestionIndex = 0; // Track the current question index

// Function to decode HTML entities
function decodeHtmlEntities(encodedStr) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedStr;
    return textarea.value;
}

// Check if data was retrieved successfully
if (dataJson) {
    console.log(dataJson);

    // Iterate over each question and display it
    for (let i = 0; i < dataJson.length; i++) {
        let result = dataJson[i];
        const decodedQuestion = decodeHtmlEntities(result.question);

        // Create a question paragraph element
        const questionParagraph = document.createElement('div');
        questionParagraph.className = 'questionCard';
        questionParagraph.id = 'question' + (i + 1);
        questionParagraph.style.display = 'none'; // Initially hide all questions

        // Create and append question elements
        const questionText = document.createElement('p');
        questionText.textContent = decodedQuestion;
        questionParagraph.appendChild(questionText);

        // Create and append answers
        const answers = [result.correct_answer, ...result.incorrect_answers];
        const shuffledAnswers = shuffleArray(answers);
        shuffledAnswers.forEach((answer) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'radio';
            checkbox.name = 'question' + (i + 1);
            checkbox.value = decodeHtmlEntities(answer);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(decodeHtmlEntities(answer)));
            questionParagraph.appendChild(label);
        });

        // Append the question paragraph to the questionDiv
        questionDiv.appendChild(questionParagraph);
    }

    // Create a container for navigation buttons
    addNavigationButtons();

    // Create and append the submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => {
        submitAnswers();
    };
    questionDiv.appendChild(submitButton);

    // Initially show the first question
    showQuestion(currentQuestionIndex);
} else {
    questionDiv.textContent = "No questions available.";
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to display the current question
function showQuestion(index) {
    const questions = document.getElementsByClassName('questionCard');
    for (let i = 0; i < questions.length; i++) {
        questions[i].style.display = 'none';
    }
    questions[index].style.display = 'block';
}

// Function to handle Next/Previous navigation
function navigateQuestion(step) {
    const totalQuestions = dataJson.length;
    currentQuestionIndex += step;
    if (currentQuestionIndex < 0) currentQuestionIndex = 0;
    if (currentQuestionIndex >= totalQuestions) currentQuestionIndex = totalQuestions - 1;
    showQuestion(currentQuestionIndex);
}

// Add navigation buttons for each question
function addNavigationButtons() {
    const totalQuestions = dataJson.length;
    for (let i = 0; i < totalQuestions; i++) {
        const questionCard = document.getElementById('question' + (i + 1));
        const navDiv = document.createElement('div');
        navDiv.style.display = 'flex';
        navDiv.style.justifyContent = 'space-between';
        navDiv.style.marginTop = '10px';

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => navigateQuestion(-1);
        if (i > 0) navDiv.appendChild(prevButton);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => navigateQuestion(1);
        if (i < totalQuestions - 1) navDiv.appendChild(nextButton);

        questionCard.appendChild(navDiv);
    }
}

// Submit answers and display results
submitAnswers = () => {
    const selectedAnswers = [];
    const totalQuestions = dataJson.length;
    let questionAnswers = [];
    let score = 0;

    for (let i = 0; i < totalQuestions; i++) {
        let color = 'red';
        const radioButtons = document.getElementsByName('question' + (i + 1));
        let userAnswer = null;

        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                userAnswer = radioButton.value;
                selectedAnswers.push({
                    question: 'Question ' + (i + 1),
                    answer: userAnswer,
                });
                const correctAnswer = decodeHtmlEntities(dataJson[i].correct_answer);
                if (userAnswer === correctAnswer) {
                    score++;
                    color = 'green';
                }
                break;
            }
        }

        if (userAnswer === null) {
            selectedAnswers.push({
                question: 'Question ' + (i + 1),
                answer: 'No answer selected',
            });
        }

        const resultDiv = document.createElement('div');
        resultDiv.className = 'questionCard';
        const questionText = document.createElement('h4');
        questionText.textContent = 'Question ' + (i + 1) + ': ' + decodeHtmlEntities(dataJson[i].question);
        resultDiv.appendChild(questionText);
        const userAnswerText = document.createElement('p');
        userAnswerText.textContent = `Your Answer: ${selectedAnswers[i].answer}`;
        userAnswerText.style.color = color;
        resultDiv.appendChild(userAnswerText);
        const correctAnswerText = document.createElement('p');
        correctAnswerText.textContent = `Correct Answer: ${decodeHtmlEntities(dataJson[i].correct_answer)}`;
        resultDiv.appendChild(correctAnswerText);
        questionAnswers.push(resultDiv);
    }

    questionDiv.innerHTML = '';
    for (let div of questionAnswers) {
        questionDiv.appendChild(div);
    }

    const scoreText = document.createElement('h3');
    scoreText.textContent = `Your Score: ${score}/${totalQuestions}`;
    questionDiv.appendChild(scoreText);

    questionDiv.scrollTo(0, 0);
};
