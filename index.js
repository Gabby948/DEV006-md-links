const fs = require('fs');
const path = require('path');
const { 
  isAbsolutePath,
  resolvePath,
  pathExists,
  isMdFile,
  readFileContent,
  extractLinksFromMdFile,
  readFilesInDirectory,
  validateLinks
  } = require('./functions.js')


 // Función principal mdLinks
function mdLinks(inputPath, options = { validate: true }) {
  const absolute = isAbsolutePath(inputPath);
  if (!absolute) {
    return Promise.reject(new Error('Invalid path. Please provide an absolute path.'));
  }

  const resolvedPath = resolvePath(inputPath);

  function processPathRecursive(directoryPath) {
    return new Promise((resolve, reject) => {
      fs.lstat(directoryPath, (err, stats) => {
        if (err) {
          reject(new Error('Error reading directory: ' + err));
          return;
        }

        if (stats.isDirectory()) {
          fs.readdir(directoryPath, (err, files) => {
            if (err) {
              reject(new Error('Error reading directory: ' + err));
              return;
            }

            const filePromises = files.map((file) => {
              const filePath = path.join(directoryPath, file);
              return processPathRecursive(filePath);
            });

            Promise.all(filePromises)
              .then((results) => resolve(results.flat()))
              .catch((err) => reject(err));
          });
        } else if (isMdFile(directoryPath)) {
          extractLinksFromMdFile(directoryPath)
            .then((links) => {
              if (options.validate) {
                return validateLinks(links);
              } else {
                resolve(links);
              }
            })
            .then((validatedLinks) => resolve(validatedLinks))
            .catch((err) => reject(err));
        } else {
          resolve([]);
        }
      });
    });
  }

  return processPathRecursive(resolvedPath);
}

// // Ejemplo de uso
// mdLinks('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo', { validate: true })
//   .then((links) => {
//     links.forEach((link) => {
//       console.log('href:', link.href);
//       console.log('text:', link.text);
//       console.log('file:', link.file);
//       console.log('--------------------------');
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

module.exports = mdLinks;

 


  
  