const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk')
const notesPath = path.join(__dirname, 'db.json');


async function addNote (titel) {
    const notes = await getNotes()
    const note = {
        titel,
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
        console.log(chalk.cyan(`${element.id}: ${element.titel}`))
    });
    
}

async function removeNotes(id) {
    const notes = await getNotes();
    const newNotes = notes.filter(element => element.id !== id);
    await fs.writeFile(notesPath, JSON.stringify(newNotes));
    console.log(chalk.bgCyan('Note was removed!'))
    await printNotes();


    
}

module.exports = {
    addNote, printNotes, removeNotes
}