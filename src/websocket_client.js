let socket = new WebSocket("ws://127.0.0.1:5050")
socket.addEventListener('open', e => {
    alert('WebSocket Opened');
    console.log("Time to open socket:" + e.timeStamp);
});

const startPoll = () => {
    const q = document.getElementById("questionFieldInput").value;
    if (socket.readyState == socket.OPEN) {
        socket.send(JSON.stringify({
                cmd: "CREATE_POLL",
                question: q
        }));
        console.log("Creating poll...")
    }
}

const vote = (vote) => {
    if (socket.readyState == socket.OPEN) {
        let name = document.getElementById('nameFieldInput').value ?? "Anonymous"
        socket.send(JSON.stringify({
            cmd: "VOTE",
            vote: vote,
            name: name
        }))
        console.log("Submitting vote: " + vote + " for '" + name + "'.")

        document.querySelectorAll('.poll-panel-btn').forEach(b => {
            b.disabled = true;
            b.classList.add("hide")
            b.setAttribute('onclick', 'noVotesLeft()');
        })
        document.getElementById("thanks").innerHTML = "<h3>Thanks for voting!</h3>"
    }
}

const noVotesLeft = () => {
    console.log("You have already voted!!");
}


socket.addEventListener('message', msg => {
    let data = JSON.parse(msg.data);
    switch (data.cmd) {
        case 'POLL_EXISTS':
            const question = data.question;
            document.getElementById("questionFieldOutput").innerText = question;
            document.getElementById('input').classList.add("hide");
            document.getElementById('output').classList.remove("hide");
            break;
        
        case 'NEW_RESULTS':
            console.log("NEW RESULTS YEP")
            let results = data.currentResults
            console.log(JSON.stringify(results));
            document.getElementById('results').innerHTML = formatResults(results);
            break;
    
        default:
            break;
    }
})

const formatResults = (results) => {
    let formatted = "<div>";
    formatted += "<h3>Votes for Yes: " + results[0].votes +  "</h3>";
    formatted += "<p><b>YES Voters</b></p>";
    if (results[0].voters.length > 0) {
        formatted += "<ul>"
        results[0].voters.forEach(voter => {
            formatted += "<li>" + voter + "</li>"
        })
        formatted += "</ul>"
    }
    formatted += "</div>"
    formatted += "<p>Percentage of votes: " + results[0].percent +  "</p>";

    formatted += "<div>"
    formatted += "<h3>Votes for No: " + results[1].votes +  "</h3>"
    formatted += "<p><b>NO Voters</b></p>";
    if (results[1].voters.length > 0) {
        formatted += "<ul>"
        results[1].voters.forEach(voter => {
            formatted += "<li>" + voter + "</li>"
        })
        formatted += "</ul>"
    }
    formatted += "<p>Percentage of votes: " + results[1].percent +  "</p>"
    formatted += "</div>"

    return formatted;
}