import ListEditor from "./ListEditor";

const listEditor = new ListEditor();
listEditor.init();

const products = [
    {title: 'iPhone 13', price: '65000'},
    {title: 'Xiaomi Redmi A1', price: '4599'},
    {title: 'Samsung Galaxy A54', price: '42299'},
]

products.forEach(el => {    
    const product = new FormData();
    product.append('title', el.title)
    product.append('price', el.price)    
    listEditor.addProduct(product)
})
