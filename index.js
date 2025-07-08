const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const pkg = require("./package.json");
const { addNote, printNotes, removeNotes } = require("./notes.controller");

yargs(hideBin(process.argv)).version(pkg.version)

yargs(hideBin(process.argv))
  .command({
    command: "add",
    describe: "Adding command",
    builder: {
        titel: {
            type: 'string',
            describe: 'Note titel',
            demandOption: true
        }
    },
    handler: function ({titel}) {
      addNote(titel)
    },
  })
  .parse();

yargs(hideBin(process.argv))
  .command({
    command: "list",
    describe: "Print all notes",
    handler: function () {
        printNotes()
    },
  })
  .parse();

  yargs(hideBin(process.argv))
  .command({
    command: "remove",
    builder: {
        id: {
            type: 'string',
            describe: 'Note id',
            demandOption: true
        }
    },
    describe: "Remove note by id",
    handler: function ({id}) {
        removeNotes(id)
    },
  })
  .parse();
