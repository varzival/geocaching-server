const apiEndpoint = '/api/';

async function create_game() {
    var response = await fetch(apiEndpoint + 'game', {
        method: "POST"
    }).then(
        response => response.json()
    );
    if (response.hasOwnProperty("code"))
        window.location.href = "game/" + response.code;
};