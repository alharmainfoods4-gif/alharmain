
async function checkReviews() {
    try {
        console.log('Fetching products...');
        const response = await fetch('http://127.0.0.1:5000/api/products?limit=100');

        console.log('Status:', response.status);
        const data = await response.json();

        const products = data.data || data.products || (Array.isArray(data) ? data : []);
        console.log('Products found:', products.length);

        let totalReviews = 0;
        products.forEach(p => {
            if (p.reviews && p.reviews.length > 0) {
                console.log(`Product: ${p.name}`);
                console.log(`- Review Count: ${p.reviews.length}`);
                console.log(`- Last Review:`, JSON.stringify(p.reviews[p.reviews.length - 1], null, 2));
                totalReviews += p.reviews.length;
            }
        });

        console.log('Total reviews found in first 100 products:', totalReviews);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkReviews();
