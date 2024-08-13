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
                if (data) {
                    document.getElementById('product-name').textContent = data.ProductName;
                    document.getElementById('srp').textContent = `₱${data.SRP}`;
                    document.getElementById('cost').textContent = `₱${data.Cost}`;
                    document.getElementById('product-image').src = data.ProductImage;

                    document.getElementById('product-name').style.display = 'block';
                    document.getElementById('srp').parentNode.style.display = 'block';
                    document.getElementById('cost').parentNode.style.display = 'block';
                    document.getElementById('product-image').style.display = 'block';
                } else {
                    document.getElementById('product-name').textContent = "Product not found";
                    document.getElementById('srp').textContent = "-";
                    document.getElementById('cost').textContent = "-";
                    document.getElementById('product-name').style.display = 'block';
                }
                loadingElement.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
                document.getElementById('product-name').textContent = "Error loading product";
                loadingElement.style.display = 'none';
                document.getElementById('product-name').style.display = 'block';
            });
        } else {
            document.getElementById('product-name').textContent = "No SKU provided";
            loadingElement.style.display = 'none';
            document.getElementById('product-name').style.display = 'block';
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
