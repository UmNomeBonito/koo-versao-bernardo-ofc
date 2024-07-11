// Script separado para funcionalidades da página koo_page.html

function addRoom() {
    var sala = document.getElementById("nome_da_sala").value;
    if (sala) {
        firebase.database().ref("/").child(sala).update({
            purpose: "adicionar sala"
        });

        // Salva a sala no localStorage
        var salas = JSON.parse(localStorage.getItem('salas')) || [];
        salas.push(sala);
        localStorage.setItem('salas', JSON.stringify(salas));

        // Cria o botão com o conteúdo da sala e o botão de exclusão
        createRoomButton(sala);

        // Limpa o campo de entrada
        document.getElementById("nome_da_sala").value = "";
    } else {
        alert("Por favor, insira o nome da sala.");
    }
}

function logout() {
    localStorage.removeItem("id");
    window.location = "index.html";
}

function loadRooms() {
    var salas = JSON.parse(localStorage.getItem('salas')) || [];
    salas.forEach(function(sala) {
        createRoomButton(sala);
    });

    // Carregar mensagens da sala atual
    var salaAtual = localStorage.getItem('sala');
    if (salaAtual) {
        loadMessages(salaAtual);
    }
}

function createRoomButton(sala) {
    var roomContainer = document.createElement("div");
    roomContainer.className = "room-container";

    var button = document.createElement("button");
    button.innerHTML = sala;
    button.className = "btn btn-primary";
    button.onclick = function() {
        localStorage.setItem('sala', sala);
        window.location = "koo_page.html";
    };

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑";
    deleteButton.className = "btn btn-danger";
    deleteButton.onclick = function() {
        deleteRoom(sala, roomContainer);
    };

    roomContainer.appendChild(button);
    roomContainer.appendChild(deleteButton);
    document.getElementById("output").appendChild(roomContainer);
}

function deleteRoom(sala, roomContainer) {
    // Remove a sala do localStorage
    var salas = JSON.parse(localStorage.getItem('salas')) || [];
    salas = salas.filter(function(item) {
        return item !== sala;
    });
    localStorage.setItem('salas', JSON.stringify(salas));

    // Remove a sala do Firebase
    firebase.database().ref("/").child(sala).remove()
        .then(function() {
            console.log("Sala removida do Firebase com sucesso.");
        })
        .catch(function(error) {
            console.error("Erro ao remover sala do Firebase: ", error);
        });

    // Remove o container da sala do DOM
    document.getElementById("output").removeChild(roomContainer);
}

function send() {
    var mensagem = document.getElementById("mensagem").value;
    var sala = localStorage.getItem('sala');

    if (mensagem && sala) {
        firebase.database().ref(sala).push({
            name: localStorage.getItem("id"),
            message: mensagem,
            like: 0
        });

        document.getElementById("mensagem").value = ""; // Limpa o campo de entrada
    } else {
        alert("Por favor, insira uma mensagem e certifique-se de que uma sala está selecionada.");
    }
}

function loadMessages(sala) {
    firebase.database().ref(sala).on('value', function(snapshot) {
        var mensagensContainer = document.getElementById("mensagens");
        mensagensContainer.innerHTML = ""; // Limpa as mensagens anteriores

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var mensagem = document.createElement("div");
            mensagem.className = "mensagem";
            mensagem.innerHTML = `<strong>${childData.name}</strong>: ${childData.message} <span class="like-button" onclick="updateLike('${childSnapshot.key}', '${sala}')">👍 ${childData.like}</span>`;
            mensagensContainer.appendChild(mensagem);
        });
    });
}

function updateLike(messageId, sala) {
    var messageRef = firebase.database().ref(sala + '/' + messageId);
    messageRef.once('value').then(function(snapshot) {
        var likes = snapshot.val().like;
        messageRef.update({ like: likes + 1 });
    });
}
