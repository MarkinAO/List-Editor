import { v4 as uuidv4 } from 'uuid';

export default class ListEditor {
    constructor() {
        this.contentBox = null;        
        this.popup = null;
        this.products = [];
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

        const contentRow = document.createElement('div');
        contentRow.classList.add('contentRow');
        this.contentBox.appendChild(contentRow);
        
        const contentBoxHeader = ['Название', 'Стоимость', 'Действия'];
        contentBoxHeader.forEach(el => {
            const div = document.createElement('div');
            div.textContent = el;
            contentRow.appendChild(div);
        })

        const popupWrap = document.createElement('div');
        this.popup = popupWrap;        
        popupWrap.classList.add('hidden');
        popupWrap.classList.add('popupWrap');
        popupWrap.innerHTML = `
            <form class="popup" name="popup">
                Название
                <input class="popupInput" name="title" type="text">
                Стоимость
                <input class="popupInput" name="price" type="text">
                <div>
                    <button class="btn-save">Сохранить</button>
                    <button class="btn-cancel">Отмена</button>
                </div>
            </form>`
        document.body.appendChild(popupWrap);

        cross.addEventListener('click', () => {
            this.showPopup();
        })

        this.contentBox.addEventListener('click', (e) => {
            this.editOrDelete(e);
        })

        popupWrap.addEventListener('click', (e) => {            
            if(!e.target.classList.contains('popup') 
            && !e.target.classList.contains('popupInput')
            &&!e.target.classList.contains('btn-save')) {
                this.hiddenPopup();
            }            
        })

        const btnCancel = this.popup.querySelector('.btn-cancel');
        btnCancel.addEventListener('click', (e) => {
            e.preventDefault();
            this.hiddenPopup();            
        })

        const btnSave = this.popup.querySelector('.btn-save');
        btnSave.addEventListener('click', (e) => {
            e.preventDefault();
            const data = new FormData(document.forms.popup);
            if(this.popup.hasAttribute('data-id')) {
                const id = this.popup.getAttribute('data-id');
                this.editProduct(data, id);
            } else {
                this.addProduct(data);
            }            
        })
    }

    editOrDelete(e) {
        if(e.target.classList.contains('delete')) {
            const perentEl = e.target.closest('.contentRow');
            const id = perentEl.getAttribute('data-id');
            this.products = this.products.filter(el => el.getAttribute('data-id') !== id);
            perentEl.remove();
        }

        if(e.target.classList.contains('edit')) {
            const perentEl = e.target.closest('.contentRow');
            const title = perentEl.querySelector('.title').textContent;
            const price = perentEl.querySelector('.price').textContent;                
            this.popup.querySelector('[name="title"]').value = title;
            this.popup.querySelector('[name="price"]').value = price;
            const id = perentEl.getAttribute('data-id');
            this.showPopup(id);
        }
    }

    addProduct(formData) {
        const contentRow = document.createElement('div');
        contentRow.classList.add('contentRow');
        contentRow.setAttribute('data-id', uuidv4());
        const productName = document.createElement('div');
        productName.classList.add('title');
        const productPrice = document.createElement('div');
        productPrice.classList.add('price');

        const title = formData.get('title');
        const price = Number(formData.get('price'));

        if(title.length > 0) {            
            productName.textContent = title;
        } else {
            const errore = {
                message: 'Недопустимое название товара',
                type: 'title'
            };
            this.renderErrore(errore);
            return
        }
        if(typeof price === 'number' && price > 0) {
            productPrice.textContent = price;
        } else {
            const errore = {
                message: 'Цена должна быть числом и больше 0',
                type: 'price'
            };
            this.renderErrore(errore);
            return
        }

        this.contentBox.appendChild(contentRow)
        contentRow.appendChild(productName)
        contentRow.appendChild(productPrice)

        const actionBox = document.createElement('div')

        const edit = document.createElement('span')
        edit.classList.add('edit')
        const delite = document.createElement('span')
        delite.classList.add('delete')

        actionBox.appendChild(edit)
        actionBox.appendChild(delite)

        contentRow.appendChild(actionBox)
        this.products.push(contentRow);
        this.hiddenPopup();
    }

    editProduct(formData, id) {
        const product = this.products.find(el => el.getAttribute('data-id') === id);
        const title = formData.get('title');
        const price = Number(formData.get('price'));
        if(title.length > 0) {            
            product.querySelector('.title').textContent = formData.get('title');
        } else {
            const errore = {
                message: 'Недопустимое название товара',
                type: 'title'
            };
            this.renderErrore(errore);
            return
        }
        if(typeof price === 'number' && price > 0) {
            product.querySelector('.price').textContent = formData.get('price');
        } else {
            const errore = {
                message: 'Цена должна быть числом и больше 0',
                type: 'price'
            };
            this.renderErrore(errore);
            return
        }
        this.hiddenPopup();
    }

    showPopup(id) {
        if(id) this.popup.setAttribute('data-id', id);
        this.popup.classList.remove('hidden');
    }

    clearPopup() {
        const inputs = [...this.popup.querySelectorAll('.popupInput')];
        inputs.forEach(el => el.value = '');
        this.popup.removeAttribute('data-id');
    }

    hiddenPopup() {
        this.popup.classList.add('hidden');
        this.clearPopup();
        this.renderErrore();
    }

    renderErrore(errore) {
        const oldErrore = [...document.querySelectorAll('.errore')];
        oldErrore.forEach(el => el.remove());
        if(!errore) return

        const errPanel = document.createElement('span');
        errPanel.classList.add('errore');
        errPanel.textContent = errore.message;
        const errPosition = document.querySelector(`[name="${errore.type}"]`);
        errPosition.after(errPanel);        
    }
}