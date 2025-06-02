const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductId = document.querySelector('#id');
const updateProductName = document.querySelector('#name');
const updateProductPrice = document.querySelector('#price');
const updateProductDescription = document.querySelector('#description');

const BACKEND = 'http://54.207.100.138:3000';

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch(`${BACKEND}/products`);
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach((product) => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price} - ${product.description}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = addProductForm.elements['id'].value;
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  !!id
    ? await updateProduct(id, name, price, description)
    : await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, price, description) {
  await fetch(`${BACKEND}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price, description }),
  });
}

// Function to delete a new product
async function deleteProduct(id) {
  await fetch(`${BACKEND}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    //body: JSON.stringify({id})
  });
}

// Function to update a product
async function updateProduct(id, name, price, description) {
  await fetch(`${BACKEND}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, price, description }),
  });
}

// Fetch all products on page load
fetchProducts();
