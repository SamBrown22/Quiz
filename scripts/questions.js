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
        questionNumber.textContent = 'Question ' + (i + 1) + ':';

        // Create the question paragraph element
        const questionParagraph = document.createElement('div');
        questionParagraph.className = 'questionCard';
        questionParagraph.id = 'question' + (i + 1);

        // Create a span for the question text and add padding
        const questionText = document.createElement('span');
        questionText.textContent = decodedQuestion;
        questionText.style.paddingBottom = '20px'; // Adjust padding as needed

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
            checkbox.type = 'checkbox'; // Set input type to checkbox
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