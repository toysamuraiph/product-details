document.addEventListener('DOMContentLoaded', function() {
    const correctPassword = 'MBSamurai28!';
    const authKey = 'authenticated';
    const authDuration = 18 * 60 * 60 * 1000;

    function authenticate() {
        const storedTimestamp = localStorage.getItem('authTimestamp');
        const now = new Date().getTime();

        if (storedTimestamp && (now - storedTimestamp) < authDuration) {
            return true;
        } else {
            const enteredPassword = prompt("Please enter the password:");
            if (enteredPassword === correctPassword) {
                localStorage.setItem('authTimestamp', now);
                return true;
            } else {
                alert("Incorrect password. Access denied.");
                document.body.innerHTML = "";
                return false;
            }
        }
    }

    if (authenticate()) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        const urlParams = new URLSearchParams(window.location.search);
        const sku = urlParams.get('sku');

        if (sku) {
            const scriptUrl = `https://script.google.com/macros/s/AKfycbwXB6JtZKoJvIWjPyb3dvI16-qO4KQTDEpDAsPvY280xGuY421AD_7vCNIq1IScYOlb/exec?sku=${sku}`;

            fetch(scriptUrl)
            .then(response => response.json())
            .then(data => {
                const productNameElement = document.getElementById('product-name');
                const srpElement = document.getElementById('srp');
                const costElement = document.getElementById('cost');
                const productImageElement = document.getElementById('product-image');

                if (data && productNameElement && srpElement && costElement && productImageElement) {
                    productNameElement.textContent = data.ProductName;
                    srpElement.textContent = `₱${data.SRP}`;
                    costElement.textContent = `₱${data.Cost}`;
                    productImageElement.src = data.ProductImage;

                    productNameElement.style.display = 'block';
                    srpElement.parentNode.style.display = 'block';
                    costElement.parentNode.style.display = 'block';
                    productImageElement.style.display = 'block';
                } else {
                    if (productNameElement) {
                        productNameElement.textContent = "Product not found";
                        productNameElement.style.display = 'block';
                    }
                    if (srpElement) {
                        srpElement.textContent = "-";
                        srpElement.parentNode.style.display = 'block';
                    }
                    if (costElement) {
                        costElement.textContent = "-";
                        costElement.parentNode.style.display = 'block';
                    }
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                }
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
                const productNameElement = document.getElementById('product-name');
                if (productNameElement) {
                    productNameElement.textContent = "Error loading product";
                    productNameElement.style.display = 'block';
                }
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            });
        } else {
            const productNameElement = document.getElementById('product-name');
            if (productNameElement) {
                productNameElement.textContent = "No SKU provided";
                productNameElement.style.display = 'block';
            }
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }

        const containerElement = document.getElementById('container');
        if (containerElement) {
            containerElement.style.display = 'block';
        }

        const showFormBtn = document.getElementById('show-form-btn');
        if (showFormBtn) {
            showFormBtn.addEventListener('click', () => {
                const formContainer = document.getElementById('form-container');
                if (formContainer) {
                    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
                }
            });
        }

        const submitSaleBtn = document.getElementById('submit-sale');
        if (submitSaleBtn) {
            submitSaleBtn.addEventListener('click', () => {
                const salePriceInput = document.getElementById('sale-price');
                const salePrice = salePriceInput ? salePriceInput.value : null;

                if (salePrice) {
                    const saleData = {
                        SKU: sku,
                        SalePrice: salePrice,
                        QuantitySold: 1 // Fixed quantity to 1
                    };

                    fetch('https://script.google.com/macros/s/AKfycbyUVG33WiH60K1jRJj7qpjX3y65OGmV_6XCy4JEpSozQgGprr-syCBorC4dMkE7vvUr1A/exec', { // Replace with your actual endpoint
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(saleData)
                    })
                    .then(response => response.json())
                    .then(result => {
                        alert('Sale recorded successfully!');
                        salePriceInput.value = '';
                    })
                    .catch(error => {
                        console.error('Error recording sale:', error);
                        alert('Error recording sale.');
                    });
                } else {
                    alert('Please enter the sale price.');
                }
            });
        }
    }
});
