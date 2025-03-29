document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-button');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.productName;
            const productPrice = this.dataset.productPrice;
            redirectToOrder(productName, productPrice);
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function redirectToOrder(productName, productPrice) {
    localStorage.setItem('productName', productName);
    localStorage.setItem('productPrice', productPrice);
    window.location.href = 'order.html';
}

if (window.location.pathname.includes('order.html')) {
    const productName = localStorage.getItem('productName');
    const productPrice = localStorage.getItem('productPrice');

    if (productName && productPrice) {
        document.getElementById('product-name').textContent = `المنتج: ${productName}`;
        document.getElementById('product-price').textContent = `السعر: ${productPrice} جنيه مصري`;
    } else {
        document.getElementById('product-name').textContent = 'المنتج: غير محدد';
        document.getElementById('product-price').textContent = 'السعر: غير محدد';
    }
}


function sendOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const productName = localStorage.getItem('productName');
    const productPrice = localStorage.getItem('productPrice');

    if (!name || !address || !phone) {
        alert('يرجى ملء جميع الحقول!');
        return;
    }

    const message = `مرحبًا، أود طلب المنتج التالي:\n\nالمنتج: ${productName}\nالسعر: ${productPrice} جنيه مصري\n\nالاسم: ${name}\nالعنوان: ${address}\nرقم الهاتف: ${phone}`;
    const whatsappURL = `https://wa.me/201022518190?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productCategory = document.getElementById('product-category').value;
    const shippingCost = document.getElementById('shipping-cost').value;
    const productImage = document.getElementById('product-image').files[0];

    if (!productImage) {
        alert('Please select a product image!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const productData = {
            name: productName,
            price: productPrice,
            category: productCategory,
            shipping: shippingCost,
            image: e.target.result,
        };

        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));

        displayProducts();
        document.getElementById('add-product-form').reset();
    };
    reader.readAsDataURL(productImage);
}


function displayProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('products');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
            ${product.name} - ${product.price} جنيه مصري - ${product.category === 'men' ? 'رجال' : 'نساء'} - الشحن: ${product.shipping} جنيه مصري
            <button onclick="deleteProduct(${index})">حذف</button>
        `;
        productList.appendChild(productItem);
    });
}

// Delete product (Admin page)
function deleteProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
}


if (window.location.pathname.includes('index.html')) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const menProducts = document.getElementById('men-products');
    const womenProducts = document.getElementById('women-products');

    products.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;">
            <h3>${product.name}</h3>
            <p>السعر: ${product.price} جنيه مصري</p>
            <p>الشحن: ${product.shipping} جنيه مصري</p>
            <button class="buy-button" onclick="redirectToOrder('${product.name}', ${product.price})">اشتر الآن</button>
        `;

        if (product.category === 'men') {
            menProducts.appendChild(productDiv);
        } else if (product.category === 'women') {
            womenProducts.appendChild(productDiv);
        }
    });
}

if (window.location.pathname.includes('admin.html')) {
    displayProducts();
    displayCoupons();
}


function toggleTheme() {
    const body = document.body;
    body.classList.toggle('night-mode');

 
    const isNightMode = body.classList.contains('night-mode');
    localStorage.setItem('theme', isNightMode ? 'night' : 'day');
}

window.onload = function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night') {
        document.body.classList.add('night-mode');
    }
};
let currentLanguage = 'en'; 

function toggleLanguage() {
    const menTitle = document.getElementById('men-title');
    const womenTitle = document.getElementById('women-title');
    const buyButtons = document.querySelectorAll('.buy-button');
    const footerText = document.getElementById('footer-text');
    const languageToggle = document.getElementById('language-toggle');

    if (currentLanguage === 'en') {

        menTitle.textContent = 'منتجات الرجال';
        womenTitle.textContent = 'منتجات النساء';
        buyButtons.forEach(button => button.textContent = 'اشتر الآن');
        footerText.textContent = 'جميع الحقوق محفوظة © 2025';
        languageToggle.textContent = 'Switch to English';
        currentLanguage = 'ar';
    } else {
        menTitle.textContent = 'Men\'s Products';
        womenTitle.textContent = 'Women\'s Products';
        buyButtons.forEach(button => button.textContent = 'Buy Now');
        footerText.textContent = 'All rights reserved © 2025';
        languageToggle.textContent = 'Switch to Arabic';
        currentLanguage = 'en';
    }
}


function addCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim();
    const couponDiscount = document.getElementById('coupon-discount').value;

    if (!couponCode || !couponDiscount) {
        alert('يرجى إدخال رمز الكوبون ونسبة الخصم!');
        return;
    }

    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    coupons.push({ code: couponCode, discount: couponDiscount });
    localStorage.setItem('coupons', JSON.stringify(coupons));

    displayCoupons();
    document.getElementById('add-coupon-form').reset();
}


function displayCoupons() {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const couponList = document.getElementById('coupon-list');
    couponList.innerHTML = '';

    coupons.forEach((coupon, index) => {
        const couponItem = document.createElement('li');
        couponItem.innerHTML = `
            رمز الكوبون: ${coupon.code} - نسبة الخصم: ${coupon.discount}%
            <button onclick="deleteCoupon(${index})">حذف</button>
        `;
        couponList.appendChild(couponItem);
    });
}

function deleteCoupon(index) {
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    coupons.splice(index, 1);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    displayCoupons();
}


function applyCoupon() {
    const couponCode = document.getElementById('coupon-input').value.trim();
    const coupons = JSON.parse(localStorage.getItem('coupons')) || [];
    const coupon = coupons.find(c => c.code === couponCode);

    if (coupon) {
        const discount = coupon.discount;
        const originalPrice = parseFloat(document.getElementById('product-price').dataset.originalPrice);
        const discountedPrice = originalPrice - (originalPrice * discount / 100);
        document.getElementById('product-price').textContent = `السعر بعد الخصم: ${discountedPrice.toFixed(2)} جنيه`;
    } else {
        alert('رمز الكوبون غير صالح!');
    }
}
db.collection("products").onSnapshot(snapshot => {
    let productsContainer = document.getElementById("products");
    productsContainer.innerHTML = ""; // مسح القائمة القديمة

    snapshot.forEach(doc => {
        let product = doc.data();
        productsContainer.innerHTML += `
            <div>
                <h3>${product.name}</h3>
                <img src="${product.image}" width="100">
                <p>السعر: ${product.price} جنيه</p>
            </div>
        `;
    });
});

db.collection("products").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
            console.log("تمت إضافة منتج جديد:", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("تم تعديل المنتج:", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("تم حذف المنتج:", change.doc.data());
        }
    });
});

db.collection("products").onSnapshot(snapshot => {
    let productsContainer = document.getElementById("products");
    productsContainer.innerHTML = ""; // مسح القائمة القديمة

    snapshot.forEach(doc => {
        let product = doc.data();
        productsContainer.innerHTML += `
            <div>
                <h3>${product.name}</h3>
                <img src="${product.image}" width="100">
                <p>السعر: ${product.price} جنيه</p>
            </div>
        `;
    });
});