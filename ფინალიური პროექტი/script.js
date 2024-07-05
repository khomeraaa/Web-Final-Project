const API_URL = 'https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news';

// DOM elements
const newsList = document.getElementById('newsList');
const createNews = document.getElementById('createNews');
const showListBtn = document.getElementById('showListBtn');
const showCreateBtn = document.getElementById('showCreateBtn');
const newsTableBody = document.getElementById('newsTableBody');
const createNewsForm = document.getElementById('createNewsForm');

// Navigation
showListBtn.addEventListener('click', () => {
    newsList.classList.add('active');
    createNews.classList.remove('active');
    fetchNews();
});

showCreateBtn.addEventListener('click', () => {
    createNews.classList.add('active');
    newsList.classList.remove('active');
});

// Fetch news
async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const news = await response.json();
        displayNews(news);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Display news
// Display news
function displayNews(news) {
    newsTableBody.innerHTML = '';
    news.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>${item.likes}</td>
            <td>${formatDate(item.dateUpdated)}</td>
            <td>${formatDate(item.dateCreated)}</td>
            <td class="action-buttons">
                <button class="delete-btn" data-id="${item.id}">Delete</button>
                <button class="update-btn" data-id="${item.id}">Update</button>
            </td>
        `;
        newsTableBody.appendChild(row);
    });
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
}

// Delete news
newsTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            e.target.closest('tr').style.animation = 'fadeOut 0.5s';
            setTimeout(() => {
                e.target.closest('tr').remove();
            }, 500);
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    }
});

// Create news
createNewsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        editorFirstName: document.getElementById('editorFirstName').value,
        editorLastName: document.getElementById('editorLastName').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            createNewsForm.reset();
            newsList.classList.add('active');
            createNews.classList.remove('active');
            fetchNews();
        }
    } catch (error) {
        console.error('Error creating news:', error);
    }
});

// Initial load
fetchNews();