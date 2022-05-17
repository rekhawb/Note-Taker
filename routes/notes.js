const nt = require('express').Router();
const {readFromFile, readAndAppend, writeToFile} = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

nt.get('/',(req,res) => {
console.log(`${req.method} request received for notes`);
readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));

})

nt.post('/',(req,res) => {
    console.log(`${req.method} received to submit notes`);
    
    const {title,text}  = req.body;

    if(title && text){
        const newNotes = {
            title,
            text,
            id: uuidv4(),
        }

        readAndAppend(newNotes,'./db/db.json');

        const response = {

            status: 'success',
            body: newNotes,
        };

        res.json(response);

    }else{
        res.json('Error in posting notes');
    }
    
});


nt.delete('/:id', (req, res) => {
    const ntId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((note) => note.id !== ntId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${ntId} has been deleted 🗑️`);
      });
  });




module.exports = nt;