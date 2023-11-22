let votes = {
    option1: 0,
    option2: 0,
};

function vote(option) {
    votes[option]++;
    updateResults();
}

function updateResults() {
    document.getElementById('option1-votes').innerText = `민초 바나나킥: ${votes.option1} 표`;
    document.getElementById('option2-votes').innerText = `아리랑 발효보리건빵: ${votes.option2} 표`;
}
