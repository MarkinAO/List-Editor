export default class ListEditor {
    constructor() {
        this.contentBox = null;
        this.errore = null;
        this.popup = null;
    }

    init() {
        const container = document.querySelector('.container');
       
        const box = document.createElement('div');
        box.classList.add('box');
        container.appendChild(box);

        const decorPanel = document.createElement('div');
        decorPanel.classList.add('decorPanel');
        box.appendChild(decorPanel);
        for (let i = 0; i < 3; i++) {            
            const cercle = document.createElement('span');
            cercle.classList.add('cercle');
            decorPanel.appendChild(cercle);
        }        

        const header = document.createElement('div');
        header.classList.add('header')
        box.appendChild(header);

        const headerTitle = document.createElement('div');
        headerTitle.classList.add('headerTitle')
        headerTitle.textContent = 'Товары';
        const cross = document.createElement('div');
        cross.classList.add('cross');
        cross.textContent = '+';

        header.appendChild(headerTitle)
        header.appendChild(cross)

        this.contentBox = document.createElement('div');
        this.contentBox.classList.add('contentBox');
        box.appendChild(this.contentBox);
        
        const contentBoxHeader = ['Название', 'Стоимость', 'Действия'];
        contentBoxHeader.forEach(el => {
            const div = document.createElement('div');
            div.textContent = el;
            this.contentBox.appendChild(div);
        })

        const popup = document.createElement('form');
        this.popup = popup;
        popup.classList.add('popup');
        popup.classList.add('hidden');
        popup.innerHTML = `
            Название
            <input class="popupInput" name="title">
            Стоимость
            <input class="popupInput" name="price">
            <div>
            <button class="btn">Сохранить</button>
            <button class="btn">Отмена</button>
            </div>`
        container.appendChild(popup);

        cross.addEventListener('click', () => {
            this.showPopup();
        })
    }

    showPopup() {
        this.popup.classList.remove('hidden');
    }

    addProduct(formData) {
        const productName = document.createElement('div');
        const productPrice = document.createElement('div');

        if(formData.title.value.length > 0) {            
            productName.textContent = formData.title.value;
        } else {
            this.errore = 'Недопустимое название товара';
            this.renderErrore();
        }
        if(typeof formData.price.value === 'number' && formData.price.value > 0) {
            productPrice.textContent = formData.price.value;
        }

        this.contentBox.appendChild(productName)
        this.contentBox.appendChild(productPrice)

        const actionBox = document.createElement('div')

        const edit = document.createElement('span')
        edit.classList.add('edit')
        const delite = document.createElement('span')
        delite.textContent = 'x'
        delite.classList.add('delite')

        actionBox.appendChild(edit)
        actionBox.appendChild(delite)

        this.contentBox.appendChild(actionBox)
    }

    render() {

    }
}