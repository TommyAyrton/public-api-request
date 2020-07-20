const body = document.querySelector('body');
const divGallery = document.getElementById('gallery');
let arrUsers = [];

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then((res) => res.json())
        .catch((error) =>
            console.log('Looks like there was a problem!', error)
        );
}

fetchData('https://randomuser.me/api/?results=12').then((data) => {
    arrUsers = [...data.results];
    generateCard(arrUsers);
});

function generateCard(users) {
    const createCards = (user, index) => {
        const cardHTML = document.createElement('div');
        cardHTML.classList.add('card');
        cardHTML.setAttribute('data-position', index);
        cardHTML.innerHTML = `            
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.thumbnail}" alt="profile ${user.name.first}">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>            
        `;
        divGallery.appendChild(cardHTML);
    };
    users.map(createCards);
}

function generateModal(index) {
    const birthday = new Date(arrUsers[index].dob.date);
    const divModal = document.createElement('div');
    divModal.classList.add('modal-container');
    divModal.innerHTML = `
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${
                arrUsers[index].picture.thumbnail
            }" alt="profile ${arrUsers[index].name.first}">
            <h3 id="name" class="modal-name cap">${
                arrUsers[index].name.first
            } ${arrUsers[index].name.last}</h3>
            <p class="modal-text">${arrUsers[index].email}</p>
            <p class="modal-text cap">${arrUsers[index].location.city}</p>
            <hr>
            <p class="modal-text">${arrUsers[index].phone}</p>
            <p class="modal-text">${arrUsers[index].location.street.number} ${
        arrUsers[index].location.street.name
    }, ${arrUsers[index].location.city}, ${arrUsers[index].location.country} ${
        arrUsers[index].location.postcode
    }</p>
            <p class="modal-text">Birthday: ${birthday.toLocaleDateString()}</p>
        </div>
    </div> 
    
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `;
    body.appendChild(divModal);
    btnCloseModal('modal-container', 'modal-close-btn');
    btnNextUser('modal-container', 'modal-next', index);
    btnPrevUser('modal-container', 'modal-prev', index);
}

function btnCloseModal(modal, btn) {
    const divModal = document.querySelector(`div.${modal}`);
    const btnClose = document.getElementById(btn);
    btnClose.addEventListener('click', () => {
        divModal.remove();
    });
}

function btnNextUser(modal, id, index) {
    const divModal = document.querySelector(`div.${modal}`);
    const btnPrev = document.getElementById(id);
    const len = arrUsers.length;
    btnPrev.addEventListener('click', () => {
        divModal.remove();
        index++;
        if (index === len) {
            generateModal(0);
        } else if (index < len) {
            generateModal(index);
        }
    });
}

function btnPrevUser(modal, id, index) {
    const divModal = document.querySelector(`div.${modal}`);
    const btnNext = document.getElementById(id);
    const len = arrUsers.length;
    btnNext.addEventListener('click', () => {
        divModal.remove();
        index--;
        if (index < 0) {
            index = len - 1;
            generateModal(index);
        } else if (index < len) {
            generateModal(index);
        }
    });
}

divGallery.addEventListener('click', (e) => {
    const element = e.target.parentElement.parentElement;
    if (element.getAttribute('class') === 'card') {
        const index = element.getAttribute('data-position');
        generateModal(index);
    }
});
