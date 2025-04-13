document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const query = document.getElementById('searchInput').value;

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
    .then(response => response.json())
    .then(data => {
        // Update the UI with the results from the server
        displayResults(data.results);
    })
    .catch(error => console.error('Error:', error));
});
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result-item');
        resultElement.innerHTML = `
            <h3>${result.name}</h3>
            <p>${result.location}</p>
            <p>${result.price}</p>
        `;
        resultsContainer.appendChild(resultElement);
    });
}
