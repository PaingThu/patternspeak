import{n as e,t}from"./modulepreload-polyfill-BvsmSo4J.js";var n,r=e((()=>{n=``+new URL(`actomic-C1w_qYcs.avif`,import.meta.url).href}));t((()=>{r();var e=[{id:1,title:`Project Hail Mary`,author:`Andy Weir`,dateRead:`2023-11-15`,rating:5,status:`Finished`,notes:`An incredible survival story. Couldn't put it down!`,cover:n},{id:2,title:`Atomic Habits`,author:`James Clear`,dateRead:`2023-10-02`,rating:4,status:`Finished`,notes:`Very practical advice on building better systems.`,cover:n},{id:3,title:`The Seven Husbands of Evelyn Hugo`,author:`Taylor Jenkins Reid`,dateRead:`2024-01-10`,rating:5,status:`Reading`,notes:`Loving the narrative structure so far.`,cover:actomicC}],t=document.getElementById(`book-grid`),i=document.getElementById(`empty-state`),a=document.getElementById(`search-input`),o=document.getElementById(`status-filter`),s=document.getElementById(`modal-overlay`),c=document.getElementById(`open-modal-btn`),l=document.getElementById(`close-modal-btn`),u=document.getElementById(`add-book-form`);function d(){let n=a.value.toLowerCase(),r=o.value,s=e.filter(e=>{let t=e.title.toLowerCase().includes(n)||e.author.toLowerCase().includes(n),i=r===`All`||e.status===r;return t&&i});if(s.length===0){t.innerHTML=``,i.classList.remove(`hidden`);return}i.classList.add(`hidden`),t.innerHTML=s.map(e=>`
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col">
            <div class="relative h-48 overflow-hidden">
                <img 
                    src="${e.cover}" 
                    alt="${e.title}" 
                    crossorigin="anonymous"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onerror="if(!this.dataset.tried){this.dataset.tried=true;this.src='https://images.unsplash.com/photo-1543004471-da7a9601a301?auto=format&fit=crop&q=80&w=400';}"
                />
                <div class="absolute top-2 right-2">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${e.status===`Finished`?`bg-emerald-100 text-emerald-700`:e.status===`Reading`?`bg-amber-100 text-amber-700`:`bg-slate-100 text-slate-700`}">
                        ${e.status}
                    </span>
                </div>
            </div>

            <div class="p-5 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg leading-tight text-slate-800 line-clamp-1">${e.title}</h3>
                    <button onclick="deleteBook(${e.id})" class="text-slate-300 hover:text-red-500 transition-colors p-1">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                
                <div class="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <i data-lucide="user" class="w-3.5 h-3.5"></i>
                    <span>${e.author}</span>
                </div>

                <p class="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                    ${e.notes||`No notes added for this book yet.`}
                </p>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div class="flex items-center gap-1 text-amber-500">
                        ${[,,,,,].fill(0).map((t,n)=>`
                            <i data-lucide="star" class="w-3.5 h-3.5 ${n<e.rating?`fill-current`:`text-slate-200`}"></i>
                        `).join(``)}
                    </div>
                    <div class="flex items-center gap-1 text-slate-400 text-xs font-medium uppercase tracking-wider">
                        <i data-lucide="calendar" class="w-3 h-3"></i>
                        ${new Date(e.dateRead).toLocaleDateString(void 0,{month:`short`,year:`numeric`})}
                    </div>
                </div>
            </div>
        </div>
    `).join(``),window.lucide&&lucide.createIcons()}c.addEventListener(`click`,()=>{s.classList.add(`active`)}),l.addEventListener(`click`,()=>{s.classList.remove(`active`)}),s.addEventListener(`click`,e=>{e.target===s&&s.classList.remove(`active`)}),u.addEventListener(`submit`,t=>{t.preventDefault();let n={id:Date.now(),title:document.getElementById(`form-title`).value,author:document.getElementById(`form-author`).value,status:document.getElementById(`form-status`).value,rating:parseInt(document.getElementById(`form-rating`).value),notes:document.getElementById(`form-notes`).value,dateRead:new Date().toISOString().split(`T`)[0],cover:`https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400`};e.unshift(n),u.reset(),s.classList.remove(`active`),d()}),a.addEventListener(`input`,d),o.addEventListener(`change`,d),window.addEventListener(`DOMContentLoaded`,()=>{d()})}))();