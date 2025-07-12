const chalk = require("chalk");
const Note = require("./models/Note");

async function addNote( fio, phone, problem) {
  await Note.create({ fio, phone, problem });
  console.log(chalk.bgCyan("Notes was added!"));
}

async function getNotes() {
  const notes = await Note.find();

  return notes;
}

module.exports = {
  addNote,
  getNotes,
};
