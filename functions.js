const fs = require('fs');
const path = require('path');
const https = require('https');



const absolutePath = (userPath) => path.isAbsolute(userPath);
console.log(absolutePath('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md'));
const resolvePath = (userPath) => path.resolve(userPath); // se convierte en ruta absoluta 
console.log(resolvePath('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md'));

// Verifica si una ruta existe en el sistema de archivos 

function isValidPath(path) {
    return new Promise((resolve, reject) => { 
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err){
          reject('Path does not exist')
          console.log(reject)
        }
        resolve(true);
        console.log(resolve)
      });
    });
  }

  // lectura de archivos
  function readingFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
  
        const isMdFile = path.extname(filePath) === '.md';
        resolve({ content: data, isMdFile });
      });
    });
  }
  
  // Verifica si la ruta es md 
  readingFile('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md')
    .then(({ content, isMdFile }) => {
      if (isMdFile) {
        console.log('Es un archivo .md');
        console.log('Contenido:');
        console.log(content);
      } else {
        console.log('No es un archivo .md');
      }
    })
    .catch((err) => {
      console.error(err);
    });
