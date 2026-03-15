const WEBHOOK_URL = "https://hook.eu1.make.com/4g2rl5l2j9uogybctr5ypsahp1k4t51s";

let cart = [];
let menu = [];

async function loadMenu() {
    const res = await fetch("menu.json");
    const data = await res.json();
    menu = data;
    renderMenu(menu);
}

function renderMenu(items) {
    const container = document.getElementById("menu");
    container.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.image}" class="food-img">
            <h3>${item.name}</h3>
            <p>${item.price} грн</p>
            <button onclick="addToCart('${item.name}', ${item.price})">
                Додати
            </button>
        `;

        container.appendChild(card);
    });
}

function addToCart(name, price) {

    const item = cart.find(i => i.name === name);

    if(item){
        item.qty += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: 1
        });
    }

    updateCart();
}

function updateCart(){

    const cartBtn = document.getElementById("cart-btn");

    let count = 0;

    cart.forEach(i=>{
        count += i.qty;
    });

    cartBtn.innerText = `🛒 ${count}`;
}

function openCart(){

    const cartBox = document.getElementById("cart");

    cartBox.innerHTML = "";

    let total = 0;

    cart.forEach(i => {

        total += i.price * i.qty;

        cartBox.innerHTML += `
            <div class="cart-item">
                ${i.name} x${i.qty}
                <span>${i.price * i.qty} грн</span>
            </div>
        `;
    });

    cartBox.innerHTML += `<h3>Разом: ${total} грн</h3>`;

}

function checkout(){

    const name = prompt("Ваше ім'я");
    const phone = prompt("Телефон");
    const address = prompt("Адреса доставки");

    const order = {
        name,
        phone,
        address,
        cart
    };

    fetch(WEBHOOK_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(order)
    })
    .then(()=>{
        alert("Замовлення відправлено!");
        cart = [];
        updateCart();
    });

}

function searchFood(){

    const val = document.getElementById("search").value.toLowerCase();

    const filtered = menu.filter(i =>
        i.name.toLowerCase().includes(val)
    );

    renderMenu(filtered);
}

function repeatOrder(){

    const last = localStorage.getItem("lastOrder");

    if(!last){
        alert("Немає попереднього замовлення");
        return;
    }

    cart = JSON.parse(last);

    updateCart();
}

window.onload = loadMenu;
