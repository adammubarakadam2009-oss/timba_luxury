// Google Sheet Configuration
const SHEET_ID = '1GTBFs4o8kxrhpaPdAGrFFFaMG6roa3QjGebl5PyU9jQ';
const SHEET_NAME = 'TIMBA WORLD';

// Fetch products from Google Sheet
async function fetchProductsFromSheet() {
  try {
    // Using Google Sheets CSV export (no API key needed)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',');
      const product = {
        name: values[0]?.trim() || '',
        price: values[1]?.trim() || '',
        image: values[2]?.trim() || 'Coming Soon',
        description: values[3]?.trim() || '',
        category: values[4]?.trim() || ''
      };
      
      if (product.name) {
        products.push(product);
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Display products on the page
async function displayProducts() {
  const productsContainer = document.getElementById('products');
  
  if (!productsContainer) {
    console.error('Products container not found');
    return;
  }
  
  // Show loading state
  productsContainer.innerHTML = '<p style="text-align:center; padding:20px;">Loading products...</p>';
  
  // Fetch products
  const products = await fetchProductsFromSheet();
  
  if (products.length === 0) {
    productsContainer.innerHTML = '<p style="text-align:center; padding:20px;">No products available yet.</p>';
    return;
  }
  
  // Clear container
  productsContainer.innerHTML = '';
  
  // Display each product
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.style.cssText = `
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    `;
    productCard.onmouseover = () => productCard.style.transform = 'scale(1.05)';
    productCard.onmouseout = () => productCard.style.transform = 'scale(1)';
    
    productCard.innerHTML = `
      <div style="background: #f0f0f0; height: 200px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <p style="text-align: center; color: #999; margin: 0;">${product.image}</p>
      </div>
      <h3 style="margin: 10px 0; font-size: 18px; color: #333;">${product.name}</h3>
      <p style="margin: 5px 0; color: #666; font-size: 14px;">${product.description}</p>
      <p style="margin: 5px 0; color: #999; font-size: 12px;">Category: ${product.category}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
        <span style="font-size: 20px; font-weight: bold; color: #25D366;">₦${product.price}</span>
        <button onclick="addToCart('${product.name}', '${product.price}')" style="background: #25D366; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">
          Add to Cart
        </button>
      </div>
    `;
    
    productsContainer.appendChild(productCard);
  });
}

// Add to cart function
function addToCart(productName, price) {
  const message = `Hi! I want to order:\n- Product: ${productName}\n- Price: ₦${price}\n\nPlease confirm availability and total price with delivery.`;
  const whatsappNumber = '2347013299620';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', displayProducts);

// Refresh products every 30 seconds
setInterval(displayProducts, 30000);
