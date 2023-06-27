// module.exports = () => {
//   // ...
// };
const { 
  absolutePath, 
  resolvePath,
  findLinksInContent,
  extractLinks, 
  validateLinks
  } = require('./functions.js')


  function mdLinks(path, options = { validate: false }) {
    const resolvedPath = resolvePath(path);
  
    if (!absolutePath(resolvedPath)) {
      throw new Error('Invalid path');
    }
  
    return pathValidation(resolvedPath)
      .then(() => {
        if (fs.statSync(resolvedPath).isDirectory()) {
          return readDirectory(resolvedPath);
        } else {
          return [resolvedPath];
        }
      })
      .then((files) => {
        const promises = files.map((file) => {
          const filePath = path.join(resolvedPath, file);
  
          if (options.validate) {
            return extractLinks(filePath)
              .then((links) => validateLinks(links))
              .catch((error) => {
                throw new Error('Error extracting and validating links: ' + error);
              });
          } else {
            return extractLinks(filePath);
          }
        });
  
        return Promise.all(promises);
      })
      .then((linksArray) => {
        // Flatten the array of links
        const links = linksArray.reduce((acc, curr) => acc.concat(curr), []);
        return links;
      })
      .catch((error) => {
        throw new Error('Error processing links: ' + error);
      });

      // Función para buscar en un directorio y procesar los archivos
      
function processDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const promises = files.map((file) => {
        const filePath = `${directoryPath}/${file}`;

        return extractLinks(filePath)
          .then((links) => validateLinks(links))
          .then((validatedLinks) => {
            console.log(`Enlaces encontrados en ${filePath}:`);
            console.log(validatedLinks);
          });
      });

      Promise.all(promises)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  });
}

// Ejemplo de uso
const directoryPath = 'C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo';

processDirectory(directoryPath)
  .then(() => {
    console.log('Procesamiento de directorio completado.');
  })
  .catch((error) => {
    console.error('Error al procesar el directorio:', error);
  });
  }

  // function mdLinks(path, options = { validate: false }) {
  //   const resolvedPath = resolvePath(path);
  //   const isDirectory = fs.statSync(resolvedPath).isDirectory();
    
  
  //   if (isDirectory) {
  //     return readDirectory(resolvedPath)
  //       .then((files) => {
  //         const promises = files.map((file) => {
  //           const filePath = path.join(resolvedPath, file);

            
  //           return readingFile(filePath).then(({ content, isMdFile }) => {
  //             if (isMdFile) {
  //               const links = findLinksInContent(content, filePath);
  //               return options.validate
  //                 ? validateLinks(links)
  //                 : Promise.resolve(links);
  //             } else {
  //               return Promise.resolve([]);
  //             }
  //           });
  //         });
  
  //         return Promise.all(promises).then((results) =>
  //           [].concat(...results)
  //         );
  //       })
  //       .catch((error) => {
  //         throw new Error('Error reading directory: ' + error);
  //       });
  //   } else {
  //     return readingFile(resolvedPath).then(({ content, isMdFile }) => {
  //       if (isMdFile) {
  //         const links = findLinksInContent(content, resolvedPath);
  //         return options.validate
          
  //           ? validateLinks(links)
  //           : Promise.resolve(links);
  //       } else {
  //         return Promise.resolve([]);
  //       }
  //     });
  //   }
  // }
  
  // function validateLinks(links) {
  //   const linkPromises = links.map((link) =>
  //     axios
  //       .head(link.href)
  //       .then((response) => ({
  //         ...link,
  //         status: response.status,
  //         ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail',
  //       }))
  //       .catch((error) => ({
  //         ...link,
  //         status: null,
  //         ok: 'fail',
  //       }))
  //   );
  
  //   return Promise.all(linkPromises);
  // }
  
  module.exports = mdLinks;

