// Retrieve data from session storage
const dataJson = JSON.parse(sessionStorage.getItem('questions'));
const questionDiv = document.getElementById('questionDiv');

// Function to decode HTML entities
function decodeHtmlEntities(encodedStr) {
    const textarea = document.createElement('textarea'); // Create a textarea element
    textarea.innerHTML = encodedStr; // Set the encoded string as its HTML
    return textarea.value; // Return the decoded string
}

// Check if data was retrieved successfully
if (dataJson) {
    console.log(dataJson); // Log the retrieved data for debugging

    // Iterate over each question and display it
    for (let i = 0; i < dataJson.length; i++) {
        let result = dataJson[i];

        // Decode the question
        const decodedQuestion = decodeHtmlEntities(result.question);

        // Create a heading for the question number
        const questionNumber = document.createElement('h4');
        questionNumber.style.marginBottom = '0px'
        questionNumber.textContent = 'Question ' + (i + 1) + ':';

        // Create the question paragraph element
        const questionParagraph = document.createElement('div');
        questionParagraph.className = 'questionCard';
        questionParagraph.id = 'question' + (i + 1);

        // Create a span for the question text and add padding
        const questionText = document.createElement('p');
        questionText.textContent = decodedQuestion;
        questionText.style.marginLeft = '10px'; 
        questionText.style.marginBottom = '5px';
        questionText.style.marginTop = '2px';


        // Append the question text to the question paragraph
        questionParagraph.appendChild(questionText);

        // Create an array with correct and incorrect answers
        const answers = [result.correct_answer, ...result.incorrect_answers];

        // Shuffle the answers
        const shuffledAnswers = shuffleArray(answers);

        // Create checkboxes for each answer
        shuffledAnswers.forEach((answer, index) => {
            const decodedAnswer = decodeHtmlEntities(answer); // Decode the answer

            // Create a label and checkbox for each answer
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'radio'; // Set input type to checkbox
            checkbox.name = 'question' + (i + 1); // Name attribute for grouping
            checkbox.value = decodedAnswer; // Set value to the answer

            // Append the checkbox and decoded answer text to the label
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(decodedAnswer));

            // Append the label to the question paragraph
            questionParagraph.appendChild(label);
        });

        // Append the question number and question card to the questionDiv
        questionDiv.appendChild(questionNumber);
        questionDiv.appendChild(questionParagraph);
    }
    // Create a container for the button
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex'; // Enable Flexbox
    buttonContainer.style.justifyContent = 'center'; // Center horizontally
    buttonContainer.style.marginTop = '20px'; // Add top margin

    // Create the submit button
    const questionBtn = document.createElement('button');
    questionBtn.textContent = 'Submit';
    questionBtn.onclick = () => {
        submitAnswers();
    };

    // Append the button to the button container
    buttonContainer.appendChild(questionBtn);

    // Append the button container to the questionDiv or your desired parent element
    questionDiv.appendChild(buttonContainer);
} else {
    questionDiv.textContent = "No questions available."; // Fallback message
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

submitAnswers = () => {
    const selectedAnswers = [];
    const totalQuestions = dataJson.length; 
    let questionAnswers = [];
    let score = 0;

    // Iterate through each question to check selected answers
    for (let i = 0; i < totalQuestions; i++) {
        let color = 'red';
        const radioButtons = document.getElementsByName('question' + (i + 1));
        let userAnswer = null; // Default to null if no answer selected

        // Find the selected radio button
        for (const radioButton of radioButtons) {
            if (radioButton.checked) { 
                userAnswer = radioButton.value; 
                selectedAnswers.push({
                    question: 'Question ' + (i + 1), 
                    answer: userAnswer 
                });

                // Compare with the correct answer
                const correctAnswer = decodeHtmlEntities(dataJson[i].correct_answer);
                if (userAnswer === correctAnswer) {
                    score++;
                    color = 'green';
                }

                break; // Exit the loop once an answer is found
            }
        }

        // If no radio button was selected, add a placeholder for unanswered question
        if (userAnswer === null) {
            selectedAnswers.push({
                question: 'Question ' + (i + 1),
                answer: 'No answer selected'
            });
        }

        // Create resultDiv to show the result for each question
        const resultDiv = document.createElement('div');
        resultDiv.className = 'questionCard';

        // Display the question
        const questionText = document.createElement('h4');
        questionText.textContent = 'Question ' + (i + 1) + ': ' + decodeHtmlEntities(dataJson[i].question);
        resultDiv.appendChild(questionText);

        // Show the user's selected answer or 'No answer selected'
        const userAnswerText = document.createElement('p');
        userAnswerText.textContent = `Your Answer: ${selectedAnswers[i].answer}`;
        userAnswerText.style.color = color;
        resultDiv.appendChild(userAnswerText);

        // Show the correct answer
        const correctAnswerText = document.createElement('p');
        correctAnswerText.textContent = `Correct Answer: ${decodeHtmlEntities(dataJson[i].correct_answer)}`;
        resultDiv.appendChild(correctAnswerText);

        questionAnswers.push(resultDiv);
    }

    // Clear the questionDiv and display results
    questionDiv.innerHTML = '';

    // Show each question with correct answer and user's answer
    for (let div of questionAnswers) {
        questionDiv.appendChild(div);
    }

    // Display the final score
    const scoreText = document.createElement('h3');
    scoreText.textContent = `Your Score: ${score}/${totalQuestions}`;
    questionDiv.appendChild(scoreText);

    // Scroll to the top of the questionDiv
    questionDiv.scrollTo(0, 0);
};

