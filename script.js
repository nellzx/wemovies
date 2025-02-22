document.addEventListener("DOMContentLoaded", () => {
    // Recupera o carrinho armazenado no sessionStorage ou inicializa um objeto vazio
    let cart = JSON.parse(sessionStorage.getItem("cart")) || {};
    
    // Seleciona os elementos da página necessários
    const cartCounter = document.querySelector(".cart_counter");
    const buyTable = document.querySelector(".buy_table");
    const totalPriceDisplay = document.querySelector(".total-price");
    
    // Define os preços dos filmes
    const moviePrices = {
        "1": 9.99, "2": 30.99, "3": 29.99, "4": 9.99, "5": 29.99, "6": 30.99
    };

    // Atualiza o contador do carrinho na interface
    const updateCartCounter = () => {
        if (cartCounter) {
            cartCounter.textContent = Object.values(cart).reduce((acc, movie) => acc + movie.quantity, 0);
        }
    };

    // Calcula e exibe o preço total dos itens no carrinho
    const updateTotalPrice = () => {
        const total = Object.keys(cart).reduce((acc, id) => acc + (cart[id].quantity * moviePrices[id]), 0);
        if (totalPriceDisplay) totalPriceDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
    };

    // Atualiza o carrinho no sessionStorage e reflete as mudanças na interface
    const updateCart = () => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();
        updateTotalPrice();
        if (buyTable) renderCart();
    };

    // Adiciona evento ao botão de voltar, limpando o armazenamento e redirecionando
    const back_button = document.querySelector(".back-button");
    if (back_button) {
        back_button.addEventListener("click", () => {
            sessionStorage.clear(); // Limpa o sessionStorage
            localStorage.clear(); // Limpa o localStorage
            window.location.href = "index.html"; // Redireciona para a página inicial
        });
    }

    // Adiciona evento aos botões de adicionar filmes ao carrinho
    document.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", () => {
            const movieDiv = button.closest(".movies");
            const movieId = button.id;
            const counter = movieDiv.querySelector(".counter");

            // Se o filme não estiver no carrinho, adiciona
            cart[movieId] = cart[movieId] || {
                title: movieDiv.querySelector("p").textContent,
                cover: movieDiv.querySelector(".movie-cover").src,
                quantity: 0
            };
            cart[movieId].quantity++;

            // Atualiza o contador e altera a cor do botão
            counter.textContent = `${cart[movieId].quantity}x`;
            button.style.backgroundColor = "green";
            updateCart();
        });
    });

    // Renderiza os filmes adicionados no carrinho
    const renderCart = () => {
        buyTable.innerHTML = ""; // Limpa a tabela antes de renderizar
        Object.keys(cart).forEach(id => {
            const movie = cart[id];
            const moviePrice = moviePrices[id] * movie.quantity;

            // Cria um elemento div representando um item do carrinho
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("cart-item");
            movieDiv.innerHTML = `
                <div style="display: flex;">
                    <div style="display: flex;">
                        <img src="${movie.cover}" style="height: 170px; margin-right: 20px">
                        <p style="margin-top: 90px; margin-right: 20px">${movie.title}</p>
                    </div>
                    <div style="margin-top: 90px">
                        <button id="in-de-button" class="decrease" data-id="${id}">-</button>
                        <span class="quantity">${movie.quantity}</span>
                        <button id="in-de-button" class="increase" data-id="${id}">+</button>
                    </div>
                </div>
                <p style="margin-top: 90px">Subtotal: <br> R$ ${moviePrice.toFixed(2)}</p>
            `;
            buyTable.appendChild(movieDiv);
        });

        // Adiciona eventos aos botões de aumentar/diminuir quantidade
        document.querySelectorAll(".increase, .decrease").forEach(button => {
            button.addEventListener("click", () => 
                updateQuantity(button.dataset.id, button.classList.contains("increase") ? 1 : -1)
            );
        });

        updateTotalPrice();
    };

    // Atualiza a quantidade de um filme no carrinho
    const updateQuantity = (id, change) => {
        if (cart[id]) {
            cart[id].quantity = Math.max(0, cart[id].quantity + change);
            if (!cart[id].quantity) delete cart[id]; // Remove do carrinho se a quantidade for 0
        }
        updateCart();
    };

    // Se a tabela de compra existir, renderiza os itens do carrinho
    if (buyTable) renderCart();
    updateCartCounter();
});