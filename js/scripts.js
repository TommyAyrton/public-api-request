/** @global */
const body = document.querySelector('body');
const divGallery = document.getElementById('gallery');
const divSearch = document.querySelector('div.search-container');
let arrUsers = [];
let len = 0;

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

fetchData('https://randomuser.me/api/?results=12&nat=us').then((data) => {
    arrUsers = [...data.results];
    generateCard(arrUsers);
    createSearchBox();
});

/**
 * @function `generateCard` function that generate a card info for each employee.
 * @param {array} users - Array employees
 */
function generateCard(users) {
    len = users.length;
    divGallery.innerHTML = '';
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

/**
 * @function `generateModal` function that generate a window modal for selected employee.
 * @param {number} index - Indicates the position of the selected employee.
 */
function generateModal(index) {
    const birthday = new Date(arrUsers[index].dob.date);
    // const phone = formatTelephone(arrUsers[index].phone);
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

/**
 * @function `btnCloseModal` function that generate close button for window modal.
 * @param {string} modal - Indicates the class name of the div 'modal'.
 * @param {string} btn - Indicates the id name of the close button.
 */
function btnCloseModal(modal, btn) {
    const divModal = document.querySelector(`div.${modal}`);
    const btnClose = document.getElementById(btn);
    /**
     * @event click#Button
     * @property - Delete the employee information card.
     */
    btnClose.addEventListener('click', () => {
        divModal.remove();
    });
}

/**
 * @function `btnNextUser` function that generate button for view the next employee.
 * @param {string} modal - Indicates the class name of the div 'modal'.
 * @param {string} id - Indicates the id name of the next button.
 * @param {number} index - Indicates the position of the selected employee.
 */
function btnNextUser(modal, id, index) {
    const divModal = document.querySelector(`div.${modal}`);
    const btnPrev = document.getElementById(id);
    if (len === 1) {
        btnPrev.style.display = 'none';
    }
    /**
     * @event click#Button
     * @property {boolean} - Shows the next employee to the current one.
     */
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

/**
 * @function `btnNextUser` function that generate button for view the preview employee.
 * @param {string} modal - Indicates the class name of the div 'modal'.
 * @param {string} id - Indicates the id name of the prev button.
 * @param {number} index - Indicates the position of the selected employee.
 */
function btnPrevUser(modal, id, index) {
    const divModal = document.querySelector(`div.${modal}`);
    const btnNext = document.getElementById(id);
    if (len === 1) {
        btnNext.style.display = 'none';
    }
    /**
     * @event click#Button
     * @property {boolean} - Shows the previous employee to the current one.
     */
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

/**
 * @function `isValidUserName` function that validate input name.
 * @param {string} username - Passed for search a employee.
 */
const isValidUserName = (username) => /^[a-zA-Z]+$/.test(username);

// The telephone number must be in the format of (555) 555-5555
// const isValidTelephone = (telephone) => {
//     return /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(
//         telephone
//     );
// };

/**
 * @function `formatTelephone` function that format input phone number.
 * @param {string} text - Passed the text to be formated.
 */
// function formatTelephone(text) {
//     // const expression = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
//     const expression = /\(\d{3}\) \d{3}-\d{4}/;
//     if (isValidTelephone(text)) {
//         console.log(text);
//     }
//     return text;
//     // return text.replace(expression, '($1) $2-$3');
// }

/**
 * @function `checkName` function that checks if the name you are looking for exists.
 * @param {string} name - Letters that match the employee's 'name'.
 * @return {array} - Array of employees that match with 'name'.
 */
const checkName = (name) => {
    const myRe = new RegExp(`^${name}`, 'i');
    // array where all users matching with the "name" parameter are saved
    let users = [];
    for (let i = 0, len = arrUsers.length; i < len; i++) {
        const userName = arrUsers[i].name.first.toLowerCase();
        if (myRe.test(userName)) {
            users.push(arrUsers[i]);
        }
    }
    return users;
};

/**
 * @function `createSearchBox` function that generate the search box.
 * @param {string} modal - Number indicating the position of the selected employee.
 * @param {string} btn - Number indicating the position of the selected employee.
 */
function createSearchBox() {
    divSearch.innerHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    const form = document.querySelector('form');
    const inputName = document.querySelector('input#search-input');
    /**
     * @event submit#Form
     * @property {boolean} - Displays the found employee or displays an alert if the employee
     * was not found.
     */
    form.addEventListener('submit', (e) => {
        const name = inputName.value;
        e.preventDefault();
        if (!isValidUserName(inputName.value)) {
            alert('Please provide only letters');
            inputName.focus();
            return;
        }
        const users = [...checkName(name)];
        const long = users.length;
        arrUsers = users;
        long > 0 ? generateCard(arrUsers) : alert('No name found');
    });
}

/**
 * @event click#Div
 * @property {boolean} - Indicates the 'parentElement.parentElement' of the selected
 * element inside the 'card' box.
 */
divGallery.addEventListener('click', (e) => {
    const element = e.target.parentElement.parentElement;
    if (element.getAttribute('class') === 'card') {
        const index = element.getAttribute('data-position');
        generateModal(index);
    }
});
