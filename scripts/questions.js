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

        // Create a container for the whole question and navigation
        const questionParagraph = document.createElement('div');
        questionParagraph.className = 'questionCard';
        questionParagraph.id = 'question' + (i + 1);

        // Create a div specifically for question content
        const questionContentDiv = document.createElement('div');
        questionContentDiv.className = 'questionContent';

        // Create text for Question number
        const questionNumber = document.createElement('h4');
        questionNumber.textContent = 'Question ' + (i + 1) + ': ';
        questionContentDiv.appendChild(questionNumber);

        // Create and append question elements
        const questionText = document.createElement('p');
        questionText.textContent = decodedQuestion;
        questionContentDiv.appendChild(questionText);

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
            questionContentDiv.appendChild(label);
        });

        // Append the question content div to the question paragraph
        questionParagraph.appendChild(questionContentDiv);

        // Create a separate div for navigation buttons
        const navDiv = document.createElement('div');
        navDiv.className = 'navDiv';

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => navigateQuestion(-1);
        if (i > 0) navDiv.appendChild(prevButton);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.style.marginLeft = 'auto';
        nextButton.onclick = () => navigateQuestion(1);
        if (i < dataJson.length - 1) navDiv.appendChild(nextButton);

        // Append the navDiv to the question paragraph
        questionParagraph.appendChild(navDiv);

        // Append the question paragraph to the main container
        questionDiv.appendChild(questionParagraph);
    }

    // Create and append the submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.type = 'submit'; // Added type for CSS targeting
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
    questions[index].style.display = 'flex';
}

// Function to handle Next/Previous navigation
function navigateQuestion(step) {
    const totalQuestions = dataJson.length;
    currentQuestionIndex += step;
    if (currentQuestionIndex < 0) currentQuestionIndex = 0;
    if (currentQuestionIndex >= totalQuestions) currentQuestionIndex = totalQuestions - 1;
    showQuestion(currentQuestionIndex);
}

// Submit answers and display results
const submitAnswers = () => {
    const selectedAnswers = []; // Users selected answers array
    const totalQuestions = dataJson.length;
    let questionAnswers = []; // Array Containing the divs for each question and corresponding answer
    let score = 0;

    for (let i = 0; i < totalQuestions; i++) {
        let color = 'red'; // Assume incorrection
        const radioButtons = document.getElementsByName('question' + (i + 1)); // Get radio buttons
        let userAnswer = null;

        for (const radioButton of radioButtons) { // Loop through radio buttons
            if (radioButton.checked) { // Check for selected
                userAnswer = radioButton.value; // Get the value from the respected radio button

                // Store selection in array
                selectedAnswers.push({
                    question: 'Question ' + (i + 1),
                    answer: userAnswer,
                });

                // Check to see if the answer was correct
                const correctAnswer = decodeHtmlEntities(dataJson[i].correct_answer);
                if (userAnswer === correctAnswer) {
                    score++;
                    color = 'green';
                }
                break;
            }
        }

        // If the Question was unanswered
        if (userAnswer === null) {
            selectedAnswers.push({
                question: 'Question ' + (i + 1),
                answer: 'No answer selected',
            });
        }

        // Create the div element for the corresponding question and store in array
        const resultDiv = document.createElement('div');
        resultDiv.className = 'answerCard';
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

    // Reset the Div Content to display answers
    questionDiv.innerHTML = '';

    // Append the users score
    const scoreText = document.createElement('h2');
    scoreText.textContent = `You Scored: ${score}/${totalQuestions}`;
    questionDiv.appendChild(scoreText);

    // Fetch each div for each question and add to the element 
    for (let div of questionAnswers) {
        questionDiv.appendChild(div);
    }

    // Move users screen to top
    questionDiv.scrollTo(0, 0);
};
