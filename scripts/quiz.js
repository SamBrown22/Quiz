let selector = document.getElementById('quizType');
let quizValue = selector.value;
let quizTypeTitle = selector.options[selector.selectedIndex].textContent; 

let quizInfo = document.getElementById('quizInfo');
let infoTitle = quizInfo.firstElementChild; //Get's the tag for the first element in quizInfo div which is Title

infoTitle.innerHTML = 'About the ' + quizTypeTitle + ' quiz' //Default's the Title to default selected text

quizcategory = {
    generalKnowledge: 9,
    programming: 18
}

selector.addEventListener('change', () => {
    quizValue = selector.value;
    quizTypeTitle = selector.options[selector.selectedIndex].textContent; 
    infoTitle.innerHTML = 'About the ' + quizTypeTitle + ' quiz';
    console.log(quizValue);
})

getQuestions = () => {
    fetchData(quizValue);
}

//Maybe encrypt before storing in sessionStorage so people cant inspect page for data
fetchData = (data) => {
    fetch('https://opentdb.com/api.php?amount=10&category='+quizcategory[data])
    .then((response) => {
        if(!response.ok){
            return Error('Network Issue could not fetch Questions')
        }

        return response.json()
    }).then((data) => {
        console.log(data.results[0].question);
        const dataJson = JSON.stringify(data.results);
        sessionStorage.setItem('questions', dataJson);
        window.location.href = `Questions.html`;
    })
}






