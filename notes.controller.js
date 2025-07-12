const chalk = require("chalk");
const Note = require("./models/Note");

async function addNote(title, owner) {
  await Note.create({ title, owner });
  console.log(chalk.bgCyan("Notes was added!"));
}

async function getNotes() {
  const notes = await Note.find();

  return notes;
}

async function removeNotes(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner});
   if(result.matchedCount === 0) {
    throw new Error('No note to delete')
  }
}

async function editNotes(id, newNote, owner) {
  const result = await Note.updateOne({ _id: id, owner }, { title: newNote });

  if(result.matchedCount === 0) {
    throw new Error('No note to edit')
  }
}
module.exports = {
  addNote,
  getNotes,
  removeNotes,
  editNotes,
};
