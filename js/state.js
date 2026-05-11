export const state = {
    currentScreen: "home",
    currentCategory: "all",
    cart: [],
    paymentMethod: "pix",

    products: [
        {
            id: 1,
            name: "Coxinha",
            emoji: "🍗",
            price: 8,
            category: "salgados",
            active: true,
        },

        {
            id: 2,
            name: "Pastel",
            emoji: "🥟",
            price: 10,
            category: "salgados",
            active: true,
        },

        {
            id: 3,
            name: "Coca-Cola",
            emoji: "🥤",
            price: 6,
            category: "bebidas",
            active: true,
        },

        {
            id: 4,
            name: "Brigadeiro",
            emoji: "🍫",
            price: 4,
            category: "doces",
            active: true,
        },

        {
            id: 5,
            name: "Mini Pizza",
            emoji: "🍕",
            price: 12,
            category: "salgados",
            active: true,
        },

        {
            id: 6,
            name: "Suco Natural",
            emoji: "🧃",
            price: 7,
            category: "bebidas",
            active: true,
        },
    ],

    sales: [],
    expenses: [],
};
