document.addEventListener('click', event => {
    if(event.target.dataset.type === 'remove') {
        const id = event.target.dataset.id;
        remove(id).then(() => {
            event.target.closest('li').remove()
        })
    }
})

document.addEventListener('click', event => {
    

    if(event.target.dataset.type === 'edit') {
        const id = event.target.dataset.id;

        const newNote = prompt("Введите свои изменения:",event.target.dataset.title);
        
        edit(id, newNote).then(()=> {
            const oldNote = event.target.closest('li');
            oldNote.firstChild.textContent = newNote;

        })

        
    }
})

async function edit(id, newNote) {
    await fetch(`/${id}`, {method: 'PUT',headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: newNote }),})
}

async function remove(id) {
  await fetch(`/${id}`, {method: 'DELETE'})
}