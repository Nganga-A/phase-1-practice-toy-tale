let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});



const toyCollection = document.getElementById('toy-collection');


function renderToyCard(toy) {
  
  const card = document.createElement('div');
  card.classList.add('card');
  const name = document.createElement('h2');
  name.textContent = toy.name;
  const image = document.createElement('img');
  image.src = toy.image;
  const likes = document.createElement('p');
  likes.textContent = `Likes: ${toy.likes}`;


  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);

  
  toyCollection.appendChild(card);
}


fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => renderToyCard(toy));
  });


// Retrieve the add toy form
const addToyForm = document.querySelector('.add-toy-form');

// Event listener for the form submission
addToyForm.addEventListener('submit', event => {
  event.preventDefault();

  // Retrieve the input values
  const nameInput = document.querySelector('input[name="name"]');
  const imageInput = document.querySelector('input[name="image"]');
  
  // Create the toy object
  const newToy = {
    name: nameInput.value,
    image: imageInput.value,
    likes: 0
  };

  // Send a POST request to create the new toy
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(toy => {
    // Render the new toy card
    renderToyCard(toy);

    // Reset the form
    addToyForm.reset();
  });
});


// Event listener for liking a toy
toyCollection.addEventListener('click', event => {
  if (event.target.classList.contains('like-btn')) {
    const card = event.target.closest('.card');
    const toyId = card.dataset.toyId;
    const likesElement = card.querySelector('p');

    // Update the number of likes in the database
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: parseInt(likesElement.textContent.split(':')[1]) + 1 })
    })
    .then(response => response.json())
    .then(updatedToy => {
      // Update the likes in the DOM
      likesElement.textContent = `Likes: ${updatedToy.likes}`;
    });
  }
});
