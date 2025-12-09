const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const colorInput = document.getElementById("color");
const yearInput = document.getElementById("year");
const imageInput = document.getElementById("image");
const addBtn = document.getElementById("addBtn");
const msgEl = document.getElementById("msg");

const searchInput = document.getElementById("search");
const filterColor = document.getElementById("filterColor");
const productList = document.getElementById("productList");
const clearStorageBtn = document.getElementById("clearStorage");

let products = [];

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="24">No image</text></svg>';

function showMsg(text, time = 2000) {
  msgEl.textContent = text;
  setTimeout(() => (msgEl.textContent = ""), time);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function save() {
  localStorage.setItem("products", JSON.stringify(products));
}

function load() {
  products = JSON.parse(localStorage.getItem("products")) || [];
}

function makeCard(product, idx) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = product.image || PLACEHOLDER;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const info = document.createElement("div");
  info.className = "meta";
  info.textContent = `${product.price} USD, ${product.year}`;

  const colorBox = document.createElement("div");
  colorBox.className = "color-box";
  colorBox.style.background = product.color;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete";
  delBtn.onclick = () => {
    products.splice(idx, 1);
    save();
    render();
  };

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(info);
  card.appendChild(colorBox);
  card.appendChild(delBtn);

  return card;
}

function render() {
  productList.innerHTML = "";

  const q = searchInput.value.trim().toLowerCase();
  const colorF = filterColor.value;

  const filtered = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) &&
      (colorF === "all" ? true : p.color === colorF)
    );
  });

  if (filtered.length === 0) {
    productList.innerHTML =
      '<p style="padding:12px;color:#666">Нет товаров</p>';
    return;
  }

  filtered.forEach((p) => {
    const realIndex = products.indexOf(p);
    productList.appendChild(makeCard(p, realIndex));
  });
}

function addProduct() {
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  const color = colorInput.value.trim();
  const year = yearInput.value.trim();
  const image = imageInput.value.trim();

  if (!name || !price || !color || !year) {
    showMsg("Заполните все поля (кроме изображения)");
    return;
  }

  if (products.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    showMsg("Машина с таким названием уже есть");
    return;
  }

  if (isNaN(price) || Number(price) <= 0) {
    showMsg("Цена неправильная");
    return;
  }

  if (isNaN(year) || Number(year) <= 0) {
    showMsg("Год неправильный");
    return;
  }

  const product = {
    name,
    price: Number(price),
    color,
    year: Number(year),
    image: isValidUrl(image) ? image : PLACEHOLDER,
  };

  products.push(product);
  save();
  render();

  nameInput.value = "";
  priceInput.value = "";
  colorInput.value = "";
  yearInput.value = "";
  imageInput.value = "";

  showMsg("Машина добавлена!");
}

addBtn.addEventListener("click", addProduct);
searchInput.addEventListener("input", render);
filterColor.addEventListener("change", render);
clearStorageBtn.addEventListener("click", () => {
  if (confirm("Удалить все сохранённые машины?")) {
    products = [];
    save();
    render();
  }
});

load();
render();
