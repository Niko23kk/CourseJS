var saveInformation = "";
var countForDefaultSort = 0;
var saveDefaultProduct = "";


function iconClick(element, str) { /*second param is unselect icon */
    element.parentNode.classList.add("js-underline-icon")
    element.classList.add("js-select-icon");

    document.querySelector(`#${str}`).classList.remove("js-select-icon");
    document.querySelector(`#${str}`).parentNode.classList.remove("js-underline-icon");

    try {
        if (element.id === "truck-icon")
            viewOtherInformation(document.querySelector(".dynamic-container"), 0);
        else if (element.id === "man-icon")
            viewOtherInformation(document.querySelector(".dynamic-container"), 1);
    } catch {
        console.error("Info no load");
    }
}


function selectOrder(element) {
    saveInformation = "";
    let parent = element.parentNode;
    let child = parent.childNodes;

    child.forEach(elem => {
        if (elem.tagName == "DIV") {
            if (elem.classList.contains("js-select-order"))
                elem.classList.remove("js-select-order");
        }
    });

    element.classList.add("js-select-order");

    iconClick(document.querySelector("#truck-icon"), "man-icon");
    selectInformation(findOrderById(element.querySelector(".order-id").innerHTML));
}


function findOrderById(element) {
    let order;
    Orders.forEach(x => {
        if (element === x.id)
            order = x;
    });
    return order;
}


function selectInformation(element) {
    document.querySelector(".current-order-id").innerHTML = `${element.id}`;
    document.querySelector(".info-customer").innerHTML = `${element.OrderInfo.customer}`;
    document.querySelector(".info-createdAt").innerHTML = `${element.OrderInfo.createdAt}`;
    document.querySelector(".info-shippedAt").innerHTML = `${element.OrderInfo.shippedAt}`;
    let totalPrice = 0;
    element.products.forEach(x => {
        totalPrice += Number(x.totalPrice);
    });
    document.querySelector(".price-text").innerHTML = `${totalPrice}`;

    selectShipToInfo(element);
    selectProductInfo(element);
}


function selectShipToInfo(element) {
    document.querySelector(".name-parcel").innerHTML = `${element.ShipTo.name}`;
    document.querySelector(".street-text").innerHTML = `${element.ShipTo.Address}`;
    document.querySelector(".zipcode-text").innerHTML = `${element.ShipTo.ZIP}`;
    document.querySelector(".region-text").innerHTML = `${element.ShipTo.Region}`;
    document.querySelector(".country-text").innerHTML = `${element.ShipTo.Country}`;
}


function selectCustomerInfo(element) {
    document.querySelector(".first-name-man").innerHTML = `${element.CustomerInfo.firstName}`;
    document.querySelector(".last-name-man").innerHTML = `${element.CustomerInfo.lastName}`;
    document.querySelector(".address").innerHTML = `${element.CustomerInfo.address}`;
    document.querySelector(".phone").innerHTML = `${element.CustomerInfo.phone}`;
    document.querySelector(".email").innerHTML = `${element.CustomerInfo.email}`;
}


function selectProductInfo(element) {
    try {
        let productsPanel = document.querySelector(".products-info");
        productsPanel.innerHTML = "";
        element.products.forEach(product => {
            productsPanel.innerHTML += `<tr>
    <td class="procuct">
        <span class="product-name">${product.name}</span><br>
        <span class="number">${product.id}</span>
    </td>
    <td class="unit-price">
        <span class="mobile-price-text">Unit price</span>
        <span class="price">${product.price}</span>
        <span class="currency-text">${product.currency}</span>
    </td>
    <td class="quantify">
        <span class="mobile-quantify-text">Quantify</span> ${product.quantity}
    </td>
    <td class="total">
        <span class="mobile-total-text">Total</span>
        <span class="price">${product.totalPrice}</span>
        <span class="currency-text">${product.currency}</span>
    </td>
    </tr>`
        });

        saveDefaultProduct = productsPanel.outerHTML;
        document.querySelector(".js-products-count").innerHTML = `(${productsPanel.childNodes.length})`;
    } catch {
        console.error("Info no load");
    }
}


function loadOrders() {
    let ordersPanel = document.querySelector(".orders-panel");
    ordersPanel.innerHTML = "";
    Orders.forEach(element => {
        ordersPanel.innerHTML += `<div class="order" onclick="selectOrder(this)">
        <span class="order-number">Ordered <span class="order-id">${element.id}</span></span>
        <span class="date">${element.OrderInfo.createdAt}</span>
        <span class="download-name">${element.OrderInfo.customer}</span>
        <span class="status">${element.OrderInfo.status}</span>
        <span class="shipped">Shipped: <span class="shipped-date">${element.OrderInfo.shippedAt}</span></span>
    </div>`
    });
    document.querySelector(".js-order-count").innerHTML = `(${ordersPanel.childNodes.length})`

    selectOrder(ordersPanel.firstChild);
};


let getSort = ({ target }) => {
    target = target.parentNode;
    try {
        countForDefaultSort++;
        if (countForDefaultSort < 3) {
            if (countForDefaultSort === 1) {
                document.querySelectorAll(".button-sort").forEach(element => {
                    element.outerHTML = `<img src="icons/down.png " alt=" " class="button-sort" onclick="getSort(event)">`;
                });
            } else if (countForDefaultSort === 2) {
                document.querySelectorAll(".button-sort").forEach(element => {
                    element.outerHTML = `<img src="icons/up.png " alt=" " class="button-sort" onclick="getSort(event)">`;
                });
            }
            const order = (target.dataset.order = (-target.dataset.order || 1)); //ascending or descending
            const index = [...target.parentNode.cells].indexOf(target); //index of column in table
            const collator = new Intl.Collator(['en'], { numeric: true });

            const comparator = (index, order) => (a, b) => order * collator.compare(
                a.children[index].innerHTML,
                b.children[index].innerHTML
            );

            for (const tBody of target.closest('table').tBodies) //sort throught element of table
                tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        } else {
            document.querySelector(".products-info").outerHTML = saveDefaultProduct;
            countForDefaultSort = 0;
            document.querySelectorAll(".button-sort").forEach(element => {
                element.outerHTML = `<img src="icons/sort.png " alt=" " class="button-sort" onclick="getSort(event)">`;
            });
        }
    } catch {
        countForDefaultSort = 0;
        console.error("Info no load");
    }
};


function viewOtherInformation(element, bool) {
    if (bool === 1) {
        if (saveInformation.length > 0) {
            [saveInformation, element.innerHTML] = [element.innerHTML, saveInformation];
        } else {
            let order = findOrderById(document.querySelector(".current-order-id").innerHTML);
            saveInformation = element.innerHTML;
            element.innerHTML = `
                <div class="processor-panel-header">
                    <div>
                        <span>Processor Information</span>
                    </div>
                </div>

                <div class="processor-info-list">
                    <div>
                         <div class="type-field">First Name:</div>
                        <div class="first-name-man"></div><br>
                    </div>

                    <div>
                        <div class="type-field">Last Name:</div>
                        <div class="last-name-man"></div><br>
                    </div>

                    <div>
                        <div class="type-field">Address:</div>
                        <div class="address"></div><br>
                    </div>

                    <div>
                        <div class="type-field">Phone:</div>
                        <div class="phone"></div><br>
                    </div>

                    <div>
                        <div class="type-field">Email:</div>
                        <div class="email"></div>
                    </div>
                </div>`
            selectCustomerInfo(order);
        }

    } else {
        if (saveInformation.length > 0) {
            [saveInformation, element.innerHTML] = [element.innerHTML, saveInformation];
        } else {
            element.innerHTML = `
                <div class="address-panel-header">
                    <div>
                        <span>Shipping Address</span>
                    </div>
                </div>

                <div class="address-info-list">
                    <div>
                        <div class="type-field">Name:</div>
                        <div class="name-parcel"></div><br>
                    </div>
                    <div>
                        <div class="type-field">Street:</div>
                        <div class="street-text"></div><br>
                    </div>
                    <div>
                        <div class="type-field">ZIP Code / City:</div>
                        <div class="zipcode-text"></div><br>
                    </div>
                    <div>
                        <div class="type-field">Region:</div>
                        <div class="region-text"></div><br>
                    </div>
                    <div>
                        <div class="type-field">Country:</div>
                        <div class="country-text"></div>
                    </div>
                </div>`
        }
    }
}

function findInOrderPanel() {
    let ordersPanel = document.querySelector(".orders-panel");
    ordersPanel.innerHTML = "";
    let findField = document.querySelector(".order-find-field").value;

    if (findField.length < 1) {
        return;
    }

    Orders.forEach(order => {
        if (order.id.indexOf(findField) != -1 || order.OrderInfo.createdAt.indexOf(findField) != -1 ||
            order.OrderInfo.customer.toLowerCase().indexOf(findField.toLowerCase()) != -1 || order.OrderInfo.status.toLowerCase().indexOf(findField.toLowerCase()) != -1 ||
            order.OrderInfo.shippedAt.indexOf(findField) != -1) {
            ordersPanel.innerHTML += `<div class="order" onclick="selectOrder(this)">
                <span class="order-number">Ordered <span class="order-id">${order.id}</span></span>
                <span class="date">${order.OrderInfo.createdAt}</span>
                <span class="download-name">${order.OrderInfo.customer}</span>
                <span class="status">${order.OrderInfo.status}</span>
                <span class="shipped">Shipped: <span class="shipped-date">${order.OrderInfo.shippedAt}</span></span>
            </div>`
        }
    });

    if (ordersPanel.innerHTML.length == 0) {
        document.querySelector(".js-order-count").innerHTML = "";
        ordersPanel.innerHTML = `<div class="no-order-error">Нет доступных заказов</div>`
        return;
    }
    document.querySelector(".js-order-count").innerHTML = `(${ordersPanel.childNodes.length})`
    selectOrder(ordersPanel.firstChild);
}


function findInProductPanel() {
    try {
        let productsPanel = document.querySelector(".products-info");
        productsPanel.innerHTML = "";
        let findField = document.querySelector(".product-find-field").value;

        findOrderById(document.querySelector(".current-order-id").innerHTML).products.forEach(product => {
            if (product.id.indexOf(findField) != -1 || product.name.toLowerCase().indexOf(findField.toLowerCase()) != -1 || product.price.indexOf(findField) != -1 ||
                product.quantity.indexOf(findField) != -1 || product.totalPrice.indexOf(findField) != -1) {
                productsPanel.innerHTML += `<tr>
            <td class="procuct">
                <span class="product-name">${product.name}</span><br>
                <span class="number">${product.id}</span>
            </td>
            <td class="unit-price">
                <span class="mobile-price-text">Unit price</span>
                <span class="price">${product.price}</span>
                <span class="currency-text">${product.currency}</span>
            </td>
            <td class="quantify">
                <span class="mobile-quantify-text">Quantify</span> ${product.quantity}
            </td>
            <td class="total">
                <span class="mobile-total-text">Total</span>
                <span class="price">${product.totalPrice}</span>
                <span class="currency-text">${product.currency}</span>
            </td>
            </tr>`
            }
        });

        saveDefaultProduct = productsPanel.outerHTML;
        document.querySelector(".js-products-count").innerHTML = `(${productsPanel.childNodes.length})`;
    } catch {
        console.error("Info no load");
    }
}


function showSitePanel(button) {
    button.classList.add("hide-site-panel");
    document.querySelector(".main-panel-top-text").style.marginLeft = "0";
    document.querySelector(".site-panel").classList.add("show-site-panel");
    document.querySelector(".footer-left-inscription").classList.add("show-site-panel");
}


function hideSitePanel() {
    console.log(window.innerWidth);
    if (window.innerWidth < 800) {
        document.querySelector(".burger-button").classList.remove("hide-site-panel");
        document.querySelector(".main-panel-top-text").style.marginLeft = "-25px";
        document.querySelector(".site-panel").classList.remove("show-site-panel");
        document.querySelector(".footer-left-inscription").classList.remove("show-site-panel");
    }
}


document.addEventListener('keydown', (event) => {
    if (event.keyCode == "13" && document.querySelector(".order-find-field") == document.activeElement) {
        event.preventDefault();
        findInOrderPanel();
    }

    if (event.keyCode == "13" && document.querySelector(".product-find-field") == document.activeElement) {
        event.preventDefault();
        findInProductPanel();
    }
});