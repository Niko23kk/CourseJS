var saveInformation = "";
var countForDefaultSort = 0;

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
    document.querySelector(".name-man").innerHTML = `${element.CustomerInfo.firstName} ${element.CustomerInfo.lastName}`;
    document.querySelector(".employee-id").innerHTML = `${element.CustomerInfo}`;
}

function selectProductInfo(element) {
    let productsPanel = document.querySelector(".products-info");
    productsPanel.innerHTML = "";
    document.querySelector(".line-items-top-text").tag
    element.products.forEach(x => {
        productsPanel.innerHTML += `<tr>
    <td class="procuct">
        <span class="product-name">${x.name}</span><br>
        <span class="number">${x.id}</span>
    </td>
    <td class="unit-price">
        <span class="mobile-price-text">Unit price</span>
        <span class="price">${x.price}</span>
        <span class="currency-text">${x.currency}</span>
    </td>
    <td class="quantify">
        <span class="mobile-quantify-text">Quantify</span> ${x.quantity}
    </td>
    <td class="total">
        <span class="mobile-total-text">Total</span>
        <span class="price">${x.totalPrice}</span>
        <span class="currency-text">${x.currency}</span>
    </td>
    </tr>`
    });
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
}

let getSort = ({ target }) => {
    target = target.parentNode;
    try {
        countForDefaultSort++;
        if (countForDefaultSort < 3) {
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
            selectProductInfo(findOrderById(document.querySelector(".current-order-id").innerHTML));
            countForDefaultSort = 0;
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
                        <div class="details-text">Details</div>
                        <div>
                            <div class="type-field">Name:</div>
                            <div class="name-man"></div>
                        </div>

                        <div>
                            <div class="type-field">Employee ID:</div>
                            <div class="employee-id"></div>
                        </div>

                        <div>
                            <div class="type-field">Job Tittle:</div>
                            <div class="job-title"></div>
                        </div>

                        <div>
                            <div class="type-field">Phone:</div>
                            <div class="phone"></div>
                        </div>
                    </div>

                    <div class="photo-man">
                        <div>Picture</div>
                        <img src="icons/avatar.png" alt="">
                    </div>
                </div>`
            selectCustomerInfo(order);
        }

    } else {
        if (saveInformation.length > 0) {
            [saveInformation, element.innerHTML] = [element.innerHTML, saveInformation];
        } else {
            element.innerHTML = `<div class="dynamic-container">

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
                </div>
            </div>`
        }
    }
}

function findInOrderPanel() {
    let ordersPanel = document.querySelector(".orders-panel");
    ordersPanel.innerHTML = "";
    let findField = document.querySelector(".order-find-field").value;

    Orders.forEach(order => {
        if (order.id.indexOf(findField) != -1 || order.OrderInfo.createdAt.indexOf(findField) != -1 ||
            order.OrderInfo.customer.indexOf(findField) != -1 || order.OrderInfo.status.indexOf(findField) != -1 ||
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

document.addEventListener('keydown', (event) => {
    if (event.keyCode == "13" && document.querySelector(".order-find-field") == document.activeElement) {
        event.preventDefault();
        findInOrderPanel();
    }
});