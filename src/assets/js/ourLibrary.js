import actomic from '/assets/images/actomic.avif';

let books = [
    {
        id: 1,
        title: "Project Hail Mary",
        author: "Andy Weir",
        dateRead: "2023-11-15",
        rating: 5,
        status: "Finished",
        notes: "An incredible survival story. Couldn't put it down!",
        cover: actomic
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        dateRead: "2023-10-02",
        rating: 4,
        status: "Finished",
        notes: "Very practical advice on building better systems.",
        cover: actomic
    },
    {
        id: 3,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        dateRead: "2024-01-10",
        rating: 5,
        status: "Reading",
        notes: "Loving the narrative structure so far.",
        cover: actomicC
    }
];

// DOM Elements
const bookGrid = document.getElementById('book-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const modalOverlay = document.getElementById('modal-overlay');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const addBookForm = document.getElementById('add-book-form');

// Functions
function renderBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                                book.author.toLowerCase().includes(searchTerm);
        const matchesStatus = selectedStatus === 'All' || book.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        bookGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    bookGrid.innerHTML = filtered.map(book => `
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col">
            <div class="relative h-48 overflow-hidden">
                <img 
                    src="${book.cover}" 
                    alt="${book.title}" 
                    crossorigin="anonymous"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onerror="if(!this.dataset.tried){this.dataset.tried=true;this.src='https://images.unsplash.com/photo-1543004471-da7a9601a301?auto=format&fit=crop&q=80&w=400';}"
                />
                <div class="absolute top-2 right-2">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        book.status === 'Finished' ? 'bg-emerald-100 text-emerald-700' : 
                        book.status === 'Reading' ? 'bg-amber-100 text-amber-700' : 
                        'bg-slate-100 text-slate-700'
                    }">
                        ${book.status}
                    </span>
                </div>
            </div>

            <div class="p-5 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg leading-tight text-slate-800 line-clamp-1">${book.title}</h3>
                    <button onclick="deleteBook(${book.id})" class="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                
                <div class="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <i data-lucide="user" class="w-3.5 h-3.5"></i>
                    <span>${book.author}</span>
                </div>

                <p class="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                    ${book.notes || "No notes added for this book yet."}
                </p>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div class="flex items-center gap-1 text-amber-500">
                        ${Array(5).fill(0).map((_, i) => `
                            <i data-lucide="star" class="w-3.5 h-3.5 ${i < book.rating ? 'fill-current' : 'text-slate-200'}"></i>
                        `).join('')}
                    </div>
                    <div class="flex items-center gap-1 text-slate-400 text-xs font-medium uppercase tracking-wider">
                        <i data-lucide="calendar" class="w-3 h-3"></i>
                        ${new Date(book.dateRead).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize Lucide icons for the new content
    if (window.lucide) lucide.createIcons();
}

function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    renderBooks();
}

// Event Listeners
openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newBook = {
        id: Date.now(),
        title: document.getElementById('form-title').value,
        author: document.getElementById('form-author').value,
        status: document.getElementById('form-status').value,
        rating: parseInt(document.getElementById('form-rating').value),
        notes: document.getElementById('form-notes').value,
        dateRead: new Date().toISOString().split('T')[0],
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
    };

    books.unshift(newBook);
    addBookForm.reset();
    modalOverlay.classList.remove('active');
    renderBooks();
});

searchInput.addEventListener('input', renderBooks);
statusFilter.addEventListener('change', renderBooks);

// Initial render
window.addEventListener('DOMContentLoaded', () => {
    renderBooks();
});