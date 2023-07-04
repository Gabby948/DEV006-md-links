const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const { JSDOM } = require('jsdom');
const axios = require('axios');


//RECIBE LA RUTA

// Verificar si la ruta es absoluta
function isAbsolutePath(inputPath) {
  return path.isAbsolute(inputPath);
}

// Convertir ruta relativa a absoluta
function resolvePath(inputPath) {
  return path.resolve(inputPath);
}

// Verificar si la ruta existe en el sistema de archivos
function pathExists(inputPath) {
  return new Promise((resolve, reject) => {
    fs.access(inputPath, fs.constants.F_OK, (err) => {
      if (err) {
        reject('Path does not exist');
      } else {
        resolve(true);
      }
    });
  });
}

// Verificar si el archivo tiene extensión .md
function isMdFile(inputPath) {
  return path.extname(inputPath) === '.md';
}

// LECTURA DE DIRECTORIOS
function readFilesInDirectory(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
        // return;
      } else {
        resolve(files);
        // console.log(resolve)
      }
    });
  });
}

// Leer contenido de un archivo
function readFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// const readExtencionMd = (inputPath) => {
//   if (path.extname(inputPath) !== '.md') {
//     throw new Error('Invalid file format. Only .md files are supported.');
//   }
//   return true;
// };



// function findLinksInContent(content, inputPath) {
//   const links = [];

//   // Convertir el contenido Markdown a HTML utilizando MarkdownIt
//   const md = new MarkdownIt();

//   const html = md.render(content);

//   // Crear un documento JSDOM a partir del HTML
//   const dom = new JSDOM(html);  // revisar

//   // Obtener todos los elementos <a> del documento
//   const anchorElements = dom.window.document.querySelectorAll('a');
//   // Recorrer los elementos <a> utilizando map()
//   anchorElements.forEach((element) => {
//     const linkText = element.textContent;
//     const linkUrl = element.getAttribute('href');
//     links.push({ href: linkUrl, text: linkText, file: inputPath });
//   });

//   return links;
// }


// Extraer los links de un archivo Markdown
function extractLinksFromMdFile(filePath) {
  return readFileContent(filePath).then((content) => {
    const links = [];
    const md = new MarkdownIt();
    const html = md.render(content);
    const dom = new JSDOM(html);

    const anchorElements = dom.window.document.querySelectorAll('a');
    anchorElements.forEach((element) => {
      const linkText = element.textContent;
      const linkUrl = element.getAttribute('href');
      links.push({ href: linkUrl, text: linkText, file: filePath });
    });

    return links;
  });
}

// // Extraer links de archivos md
// function extractLinks(inputPath) {
//   return readFileInDirectory(inputPath)
//     .then((content) => {
//       return {
//         content: content,
//         isMdFile: readExtencionMd(inputPath)
//       };
//     })
//     .then(({ content, isMdFile }) => {
//       if (isMdFile) {
//         return findLinksInContent(content, inputPath);
//       } else {
//         return [];
//       }
//     })
//     .catch((err) => {
//       throw new Error('Error reading file: ' + err);
//     });
// }
function validateLinks(links) {
  const linkPromises = links.map((link) => {
    return axios.get(link.href)
      .then((response) => {
        const { status } = response;
        const statusText = status >= 200 && status < 400 ? 'ok' : 'fail';

        return {
          href: link.href,
          text: link.text,
          file: link.file,
          status: status,
          ok: statusText,
        };
      })
      .catch((error) => {
        return {
          href: link.href,
          text: link.text,
          file: link.file,
          status: 0,
          ok: 'fail',
        };
      });
  });
  // console.log(linkPromises, 'hasta aqui');
  return Promise.all(linkPromises);
}
// const mockLinks = [
//   { href: 'https://nodejs.org/', text: 'Node.js', file: 'C:\\Users\\Gabi\\OneDrive\\Escritorio\\DEV006-md-links\\demo\\test2.md' },
//   { href: 'https://es.wikipedia.org/l,dlsdwiki/Markdown2', text: 'Markdown', file: 'C:\\Users\\Gabi\\OneDrive\\Escritorio\\DEV006-md-links\\demo\\test1.md' },
// ];

// validateLinks(mockLinks).then(res =>console.log(res, "probando links"))


module.exports = {

  isAbsolutePath,
  resolvePath,
  pathExists,
  isMdFile,
  readFileContent,
  extractLinksFromMdFile,
  readFilesInDirectory,
  validateLinks

};