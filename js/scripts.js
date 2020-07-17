const divGallery = document.getElementById('gallery');

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
    generateCard(data.results);
});

function generateCard(data) {
    // Loop over the array `data` returned
    for (let i = 0, len = data.length; i < len; i++) {
        const divCard = document.createElement('div');
        divCard.className = 'card';

        // Create div with users images
        const divCardImg = document.createElement('div');
        divCardImg.className = 'card-img-container';
        const img = document.createElement('img');
        img.setAttribute('class', 'card-img');
        img.setAttribute('src', `${data[i].picture.thumbnail}`);
        img.setAttribute('alt', `profile picture ${data[i].name.first}`);
        divCardImg.appendChild(img);
        divCard.appendChild(divCardImg);

        // Create div with users info
        const divCardInfo = document.createElement('div');
        divCardInfo.className = 'card-info-container';
        const h3 = document.createElement('h3');
        h3.setAttribute('id', 'name');
        h3.setAttribute('class', 'card-name cap');
        h3.innerText = `${data[i].name.first} ${data[i].name.last}`;
        const pEmail = document.createElement('p');
        pEmail.className = 'card-text';
        pEmail.innerText = `${data[i].email}`;
        const pCity = document.createElement('p');
        pCity.className = 'card-text cap';
        pCity.innerText = `${data[i].location.city}, ${data[i].location.state}`;
        divCardInfo.appendChild(h3);
        divCardInfo.appendChild(pEmail);
        divCardInfo.appendChild(pCity);

        // AppendChild to "Gallery"
        divCard.appendChild(divCardInfo);
        divGallery.appendChild(divCardImg);
        divGallery.appendChild(divCard);
    }
}
