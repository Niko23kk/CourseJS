var saveShippingAndProcessorInformation = "";
var countForDefaultSort = 0;
var saveDefaultSortProduct = "";
var saveSortField = "";


function iconClick(icon, unselecticon) { /*second param is unselect icon */
    try {
        if (icon.id === "truck-icon" && !icon.classList.contains("select-icon"))
            viewOtherInformation(document.querySelector(".dynamic-container"), 0);
        else if (icon.id === "man-icon" && !icon.classList.contains("select-icon"))
            viewOtherInformation(document.querySelector(".dynamic-container"), 1);
    } catch {
        console.error("Info no load");
    }

    icon.parentNode.classList.add("underline-icon")
    icon.classList.add("select-icon");

    document.querySelector(`#${unselecticon}`).classList.remove("select-icon");
    document.querySelector(`#${unselecticon}`).parentNode.classList.remove("underline-icon");

}


function selectOrder(divOrder) {
    saveShippingAndProcessorInformation = "";
    let parent = divOrder.parentNode;
    let child = parent.childNodes;

    child.forEach(order => {
        if (order.tagName == "DIV") {
            if (order.classList.contains("select-order"))
                order.classList.remove("select-order");
        }
    });

    document.querySelector(".product-find-field").value = ""; //zeroing fields
    document.querySelectorAll(".button-sort").forEach(divOrder => {
        divOrder.outerHTML = `<img src="icons/sort.png " alt=" " class="button-sort" onclick="getSort(event)">`;
    });

    divOrder.classList.add("select-order");
    iconClick(document.querySelector("#truck-icon"), "man-icon");
    selectInformation(findOrderById(divOrder.querySelector(".order-id").innerHTML));
}


function findOrderById(carentId) {
    let order;
    Orders.forEach(carentOrder => {
        if (carentId === carentOrder.id)
            order = carentOrder;
    });
    return order;
}


function selectInformation(order) {
    document.querySelector(".current-order-id").innerHTML = `${order.id}`;
    document.querySelector(".info-customer").innerHTML = `${order.OrderInfo.customer}`;
    document.querySelector(".info-createdAt").innerHTML = `${order.OrderInfo.createdAt}`;
    document.querySelector(".info-shippedAt").innerHTML = `${order.OrderInfo.shippedAt}`;
    let totalPrice = 0;
    order.products.forEach(carentProduct => {
        totalPrice += Number(carentProduct.totalPrice);
    });
    document.querySelector(".price-text").innerHTML = `${totalPrice}`;

    selectShipToInfo(order);
    selectProductInfo(order, 1);
}


function selectShipToInfo(order) {
    document.querySelector(".name-parcel").innerHTML = `${order.ShipTo.name}`;
    document.querySelector(".street-text").innerHTML = `${order.ShipTo.Address}`;
    document.querySelector(".zipcode-text").innerHTML = `${order.ShipTo.ZIP}`;
    document.querySelector(".region-text").innerHTML = `${order.ShipTo.Region}`;
    document.querySelector(".country-text").innerHTML = `${order.ShipTo.Country}`;
}


function selectCustomerInfo(order) {
    document.querySelector(".first-name-man").innerHTML = `${order.CustomerInfo.firstName}`;
    document.querySelector(".last-name-man").innerHTML = `${order.CustomerInfo.lastName}`;
    document.querySelector(".address").innerHTML = `${order.CustomerInfo.address}`;
    document.querySelector(".phone").innerHTML = `${order.CustomerInfo.phone}`;
    document.querySelector(".email").innerHTML = `${order.CustomerInfo.email}`;
}


function selectProductInfo(order, save) {
    try {
        let productsPanel = document.querySelector(".products-info");
        productsPanel.innerHTML = "";
        order.products.forEach(product => {
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
        if (save === 1) {
            saveDefaultSortProduct = productsPanel.outerHTML;
        }
        document.querySelector(".js-products-count").innerHTML = `(${productsPanel.childNodes.length})`;
    } catch {
        console.error("Info no load");
    }
}


function loadOrders() {

    let ordersPanel = document.querySelector(".orders-panel");
    ordersPanel.innerHTML = "";

    try {
        if (Orders.length === 0) {
            document.querySelector(".js-order-count").innerHTML = "";
            ordersPanel.innerHTML = `<div class="no-order-error">Нет доступных заказов</div>`;
            return;
        }
    } catch {

        document.querySelector(".js-order-count").innerHTML = "";
        ordersPanel.innerHTML = `<div class="no-order-error">Нет доступных заказов</div>`;
        return;
    }

    Orders.forEach(order => {
        ordersPanel.innerHTML += `<div class="order" onclick="selectOrder(this)">
        <span class="order-number">Ordered <span class="order-id">${order.id}</span></span>
        <span class="date">${order.OrderInfo.createdAt}</span>
        <span class="download-name">${order.OrderInfo.customer}</span>
        <span class="status">${order.OrderInfo.status}</span>
        <span class="shipped">Shipped: <span class="shipped-date">${order.OrderInfo.shippedAt}</span></span>
    </div>`
    });
    document.querySelector(".js-order-count").innerHTML = `(${ordersPanel.childNodes.length})`


    selectOrder(ordersPanel.firstChild);
};


let getSort = ({ target }) => {
    const indexOfColumn = [...target.parentNode.parentNode.cells].indexOf(target.parentNode); //index of column in table

    if (saveSortField.length === 0) {
        saveSortField = indexOfColumn;
    }

    if (saveSortField === indexOfColumn) {
        countForDefaultSort++;
    } else {
        saveSortField = indexOfColumn;
        countForDefaultSort = 1;
    }

    let saveTarget = target;
    target = target.parentNode;
    try {
        if (countForDefaultSort < 3) {
            if (countForDefaultSort === 1) {
                for (let index = 1; index <= target.parentNode.childNodes.length - 1; index += 2) {
                    if (target.parentNode.childNodes[index] === target) {
                        sortTable(index, findOrderById(document.querySelector(".current-order-id").innerHTML), 1);
                        break;
                    }
                }
                document.querySelectorAll(".button-sort").forEach(element => {
                    if (element != saveTarget) {
                        element.outerHTML = `<img src="icons/sort.png " alt=" " class="button-sort" onclick="getSort(event)">`;
                    }
                });
                saveTarget.outerHTML = `<img src="icons/down.png" alt="" class="button-sort" onclick="getSort(event)">`
            } else if (countForDefaultSort === 2) {
                for (let index = 1; index <= target.parentNode.childNodes.length - 1; index += 2) {
                    if (target.parentNode.childNodes[index] === target) {
                        sortTable(index, findOrderById(document.querySelector(".current-order-id").innerHTML), 0);
                        break;
                    }
                }
                document.querySelectorAll(".button-sort").forEach(element => {
                    if (element != saveTarget) {
                        element.outerHTML = `<img src="icons/sort.png " alt=" " class="button-sort" onclick="getSort(event)">`;
                    }
                });
                saveTarget.outerHTML = `<img src="icons/up.png " alt=" " class="button-sort" onclick="getSort(event)">`;
            }
        } else {
            document.querySelector(".products-info").outerHTML = saveDefaultSortProduct;
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

function sortTable(indexOfColumn, order, asc) {
    let sortField;
    if (indexOfColumn === 1) {
        sortField = "name";
    }
    if (indexOfColumn === 3) {
        sortField = "price";
    }
    if (indexOfColumn === 5) {
        sortField = "quantity";
    }
    if (indexOfColumn === 7) {
        sortField = "totalPrice";
    }

    let resultSort = JSON.parse(JSON.stringify(order));

    resultSort.products.sort(function(a, b) {
        let c = a[`${sortField}`];
        let d = b[`${sortField}`];

        if (!isNaN(c - 0)) {
            c -= 0;
            d -= 0;
        }
        if (asc === 1) {
            if (c < d) {
                return -1;
            } else if (c > d) {
                return 1;
            }
            return 0;
        } else {
            if (c > d) {
                return -1;
            } else if (c < d) {
                return 1;
            }
            return 0;
        }
    });
    selectProductInfo(resultSort, 0);


}


function viewOtherInformation(infoPanel, bool) {
    if (bool === 1) {
        if (saveShippingAndProcessorInformation.length > 0) {
            [saveShippingAndProcessorInformation, infoPanel.innerHTML] = [infoPanel.innerHTML, saveShippingAndProcessorInformation];
        } else {
            let order = findOrderById(document.querySelector(".current-order-id").innerHTML);
            saveShippingAndProcessorInformation = infoPanel.innerHTML;
            infoPanel.innerHTML = `<div class="processor-panel-header">
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
        if (saveShippingAndProcessorInformation.length > 0) {
            [saveShippingAndProcessorInformation, infoPanel.innerHTML] = [infoPanel.innerHTML, saveShippingAndProcessorInformation];
        } else {
            infoPanel.innerHTML = `<div class="address-panel-header">
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

    if (findField.length == 0) {
        document.querySelector(".js-order-count").innerHTML = "";
        ordersPanel.innerHTML = `<div class="no-order-error">Нет доступных заказов</div>`
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

        saveDefaultSortProduct = productsPanel.outerHTML;
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