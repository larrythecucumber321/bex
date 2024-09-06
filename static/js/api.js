async function fetchPools() {
    try {
        const response = await fetch('/api/pools');
        const data = await response.json();
        return data.pools;
    } catch (error) {
        console.error('Error fetching pools:', error);
        return [];
    }
}
