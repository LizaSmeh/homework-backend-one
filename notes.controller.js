const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk')
const notesPath = path.join(__dirname, 'db.json');


async function addNote (title) {
    const notes = await getNotes()
    const note = {
        title,
        id: Date.now().toString()
    }
    notes.push(note);
    await fs.writeFile(notesPath, JSON.stringify(notes))

    console.log(chalk.bgCyan('Notes was added!'))
}

async function getNotes () {
    const notes = await fs.readFile(notesPath, {encoding: 'utf-8'})

    return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function printNotes () {

    const notes = await getNotes();

    console.log(chalk.bgCyan('Here is the list of notes:'));
    notes.forEach(element => {
        console.log(chalk.cyan(`${element.id}: ${element.title}`))
    });
    
}

async function removeNotes(id) {
    const notes = await getNotes();
    const newNotes = notes.filter(element => element.id !== id);
    await fs.writeFile(notesPath, JSON.stringify(newNotes));
    // console.log(chalk.bgCyan('Note was removed!'))
    // await printNotes();    
}

async function editNotes(id, newNote) {
    const notes = await getNotes();
    const noteIndex = notes.findIndex(element => element.id === id);
    if(noteIndex !== -1) {
        notes[noteIndex].title = newNote;
         await fs.writeFile(notesPath, JSON.stringify(notes));
    }
    
}
module.exports = {
    addNote, getNotes, removeNotes, editNotes
}