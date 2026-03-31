const API = "http://localhost:8000/api/dishes";

// const UNSPLASH_KEY = "1kzL5D4rxEZZlTTIcKwnezzbxBHQI2AFLIxhM_MKmtw";

const UNSPLASH_KEY = "NrEOPDsEbByygJbWAHUboXuADOhnn48dyi7n6sgZdSw";


let dishes = [];
let cart = [];

const user = JSON.parse(localStorage.getItem("user"));
const isAdmin = user && user.role && user.role.toLowerCase() === "admin";

const grid = document.getElementById("grid");
const modal = document.getElementById("modal");

// token paėmimas
function getToken() {
  const t = localStorage.getItem("token");
  try {
    return JSON.parse(t)?.token || t;
  } catch {
    return t;
  }
}

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

// Unsplash random image pagal keyword
async function getImage(keyword) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${keyword}&client_id=${UNSPLASH_KEY}`
    );

    const data = await res.json();

    console.log("UNSPLASH:", data);

    if (!res.ok || !data.urls) {
      return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";
    }

    return data.urls.small;

  } catch (err) {
    console.error(err);
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";
  }
}
// CREATE CARD
function createCard(dish) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${dish.image}">
    <div class="card-content">
      <h3>${dish.title}</h3>
      <p>${dish.description}</p>
      <p class="price">€${dish.price}</p>
    </div>
  `;

  grid.appendChild(div);
}

// ADD DISH
async function addDish() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("desc").value;

  const image = await getImage(title);

  const token = getToken(); 

  if (!token) {
    alert("Prisijunk!");
    return;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({
      title,
      price,
      description,
      image
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Klaida");
    return;
  }

  createCard(data);
  closeModal();
}

loadDishes();

// LOAD
async function loadDishes() {
  const res = await fetch(API);
  dishes = await res.json();
  renderDishes(dishes);
}

//  CREATE CARD 
function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "card";
  card.onclick = () => openModal(dish);

  const img = document.createElement("img");
img.src =
  dish.image ||
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.textContent = dish.title;

  const desc = document.createElement("p");
  desc.textContent = dish.description;

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = dish.price + "€";

  const rating = document.createElement("div");
  rating.textContent = `⭐ ${dish.rating} (${dish.ratingCount})`;

  const actions = document.createElement("div");
  actions.className = "actions";

  // RATE
  const rateBtn = document.createElement("button");
  rateBtn.textContent = "⭐";
  rateBtn.onclick = (e) => {
    e.stopPropagation();
    ivertintiPatiekala(dish._id); // 🔥 FIX
  };

  // CART
  const cartBtn = document.createElement("button");
  cartBtn.textContent = "🛒";
  cartBtn.onclick = (e) => {
    e.stopPropagation();
    addToCart(dish);
  };

  actions.appendChild(rateBtn);
  actions.appendChild(cartBtn);

  // ADMIN
  const currentUser = JSON.parse(localStorage.getItem("user"));

if (true) {

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editDish(dish._id);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteDish(dish._id);
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
  }

  body.append(title, price, rating, actions, desc);
  card.append(img, body);

  return card;
}

// RENDER
function renderDishes(data) {
  if (!grid) return;

  grid.innerHTML = "";

  data.forEach((dish) => {
    const card = createDishCard(dish);
    grid.appendChild(card);
  });
}

// RATE 
async function ivertintiPatiekala(id) {
  const token = getToken(); 

  if (!token) {
    alert("Prisijunk!");
    return;
  }

  await fetch(`${API}/${id}/rate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}` 
    }
  });
}

// DELETE 
async function deleteDish(id) {
 if (!confirm("Ar tikrai ištrinti?")) return;

 const token = getToken(); 

 await fetch(`${API}/${id}`, {
   method: "DELETE",
   headers: {
     "Authorization": `Bearer ${token}` 
   }
 });

 loadDishes();
}

// EDIT 
function editDish(id) {
  const dish = dishes.find((d) => d._id === id);

  const modal = document.getElementById("modal");
  modal.innerHTML = "";
  modal.style.display = "flex";

  const content = document.createElement("div");
  content.className = "modal-content";

  const titleInput = document.createElement("input");
  titleInput.value = dish.title;

  const priceInput = document.createElement("input");
  priceInput.value = dish.price;

  const imageInput = document.createElement("input");
  imageInput.value = dish.image;

  const descInput = document.createElement("textarea");
  descInput.value = dish.description;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "💾 Išsaugoti";
  saveBtn.onclick = () =>
    updateDish(id, titleInput, priceInput, imageInput, descInput);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "❌";
  closeBtn.onclick = closeModal;

  content.append(
    titleInput,
    priceInput,
    imageInput,
    descInput,
    saveBtn,
    closeBtn
  );

  modal.appendChild(content);
}

// UPDATE 
async function updateDish(id, title, price, image, description) {
  let imgValue = image.value;

  if (!imgValue) {
   imgValue = await getImage(title.value);
  }

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
 "Content-Type": "application/json",
 "Authorization": `Bearer ${getToken()}` 
},
    body: JSON.stringify({
      title: title.value,
      price: price.value,
      image: imgValue,
      description: description.value,
    }),
  });

  closeModal();
  loadDishes();
}

// CART 
function addToCart(dish) {
  cart.push(dish);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart");
  container.innerHTML = "";

  cart.forEach((dish, index) => {
    const item = document.createElement("div");

    const text = document.createElement("span");
    text.textContent = `${dish.title} - ${dish.price}€`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      renderCart();
    };

    item.append(text, removeBtn);
    container.appendChild(item);
  });
}

// MODAL 
function openModal(dish) {
  const modal = document.getElementById("modal");
  modal.innerHTML = "";
  modal.style.display = "flex";

  const content = document.createElement("div");
  content.className = "modal-content";

  // jei nėra dish → ADD mode
  if (!dish) {
    const titleInput = document.createElement("input");
    titleInput.placeholder = "Pavadinimas";

    const priceInput = document.createElement("input");
    priceInput.placeholder = "Kaina";

    const descInput = document.createElement("textarea");
    descInput.placeholder = "Aprašymas";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Pridėti";
    addBtn.onclick = () =>
      addDishFromModal(titleInput, priceInput, descInput);

    content.append(titleInput, priceInput, descInput, addBtn);
  } else {

    //  VIEW mode
    const title = document.createElement("h2");
    title.textContent = dish.title;

    const img = document.createElement("img");
    img.src =
  dish.image ||
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400";

    const desc = document.createElement("p");
    desc.textContent = dish.description;

    const price = document.createElement("b");
    price.textContent = dish.price + "€";

    content.append(title, img, desc, price);
  }

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Uždaryti";
  closeBtn.onclick = closeModal;

  content.appendChild(closeBtn);
  modal.appendChild(content);
}

/// kad add veiktu
async function addDishFromModal(titleInput, priceInput, descInput) {
  const title = titleInput.value;
  const price = priceInput.value;
  const description = descInput.value;

  const image = await getImage(title);

  const token = getToken();

  if (!token) {
    alert("Prisijunk!");
    return;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      price,
      description,
      image
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Klaida");
    return;
  }

  loadDishes();
  closeModal();
}
 
// CLOSE
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// register
async function register() {
 const email = document.getElementById("email").value;
 const password = document.getElementById("password").value;

 const res = await fetch(`http://localhost:8000/api/auth/register`, {
   method: "POST",
   headers: {
     "Content-Type": "application/json"
   },
   body: JSON.stringify({ userEmail: email, userPassword: password })
 });

 const data = await res.json();
 console.log(data);

 alert("Registracija sėkminga");
 window.location.href = "login.html";
}

// login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:8000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userEmail: email,
      userPassword: password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Blogi duomenys");
    return;
  }

 if (data.user) {
  localStorage.setItem("user", JSON.stringify(data.user));
}
 localStorage.setItem("token", data.token);

  alert("Prisijungta");
  window.location.href = "index.html?refresh=true";
}


/// prisijungimo ir register mygtukai
function renderAuth() {
  const container = document.getElementById("auth");
  if (!container) return;

  let user = localStorage.getItem("user");

  try {
    user = JSON.parse(user);
  } catch {
    user = null;
  }

  container.innerHTML = "";

  if (user) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Atsijungti";
    logoutBtn.onclick = logout;

    container.appendChild(logoutBtn);
  } else {
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Prisijungti";
    loginBtn.onclick = () => window.location.href = "login.html";

    const registerBtn = document.createElement("button");
    registerBtn.textContent = "Registruotis";
    registerBtn.onclick = () => window.location.href = "register.html";

    container.append(loginBtn, registerBtn);
  }
}
// START 
if (document.getElementById("dishes")) {
 loadDishes();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAuth();
});

 renderAuth();