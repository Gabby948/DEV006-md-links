const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const { JSDOM } = require('jsdom');
const axios = require('axios');
const https = require('https');


//RECIBE LA RUTA

const absolutePath = (userPath) => path.isAbsolute(userPath); // ES LA RUTA ABSOLUTA
// console.log(absolutePath('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md'));
const resolvePath = (userPath) => path.resolve(userPath); // se convierte en ruta absoluta 
// console.log(resolvePath('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md'));

// Verifica si una ruta existe en el sistema de archivos 

function validatePath(path) {
    return new Promise((resolve, reject) => { 
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err){
          reject('Path does not exist')
          // console.log(reject)
        }
        resolve(true);
        // console.log(resolve)
      });
    });
  }
  // LECTURA DE DIRECTORIOS
  function readDirectory(directoryPath) {
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
  readDirectory('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo')
  .then((files) => {
    console.log('Files in directory:', files);
  })
  .catch((error) => {
    // console.error('Error reading directory:', error);
  });

  // LECTURA DE ARCHIVOS
  function readingFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject(err);
          return;
        }
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const isMdFile = path.extname(filePath) === '.md';
        const links = findLinksInContent(data, filePath);
        // resolve({ content: data.toString(), isMdFile });
        resolve({ content: data, isMdFile, links })
      });
    });
  });
  }
  
  // Verifica si la ruta es md 
  readingFile('C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md')
  .then(({ content, isMdFile, links }) => {
    if (isMdFile) {
      console.log('It is a .md file');
      console.log('Content:');
      console.log(content);

      const filePath = 'C:/Users/Gabi/OneDrive/Escritorio/DEV006-md-links/demo/test1.md';
      const fileName = path.basename(filePath); // Extraer solo el nombre del archivo
      const links = findLinksInContent(content, fileName);
      console.log('Enlaces encontrados:');
      console.log(links);
    } else {
      console.log('Not a .md file');
    }
  })
  .catch((err) => {
    console.error(err);
  });

    // function findLinksInContent(content, filePath) {
    //   const links = [];
    
    //   // Convertir el contenido Markdown a HTML utilizando MarkdownIt
    //   const md = new MarkdownIt();
  
    //   const html = md.render(content);
    
    //   // Crear un documento JSDOM a partir del HTML
    //   const dom = new JSDOM(html);  // revisar
    
    //   // Obtener todos los elementos <a> del documento
    //   const anchorElements = dom.window.document.querySelectorAll('a');
    //   console.log(findLinksInContent)
    
    //   // Recorrer los elementos <a> utilizando map()
    //   anchorElements.forEach((element) => {
    //     const linkText = element.textContent;
    //     const linkUrl = element.getAttribute('href');
    //     links.push({ href: linkUrl, text: linkText, file: filePath });
    //   });
    
    //   return links;
    // }

    function findLinksInContent(content, filePath) {
      const links = [];
    
      // Convertir el contenido Markdown a HTML utilizando MarkdownIt
      const md = new MarkdownIt();
      const tokens = md.parse(content);
    
      // Recorrer los tokens del contenido analizado
      tokens.forEach((token) => {
        if (token.type === 'link_open') {
          const href = token.attrGet('href');
          const linkText = tokens[tokens.indexOf(token) + 1].content;
          links.push({ href, text: linkText, file: filePath });
        }
      });
    
      return links;
    }
    
    // Extraer links de md
    function extractLinks(filePath) {
      return readingFile(filePath)
        .then(({ content, isMdFile }) => {
          if (isMdFile) {
            return findLinksInContent(content, filePath);
          } else {
            return [];
          }
        })
        .catch((err) => {
          throw new Error('Error reading file: ' + err);
        });
    }

 // 
    // function validateLinks(links) {
    //   const promises = links.map((link) => {
    //     return new Promise((resolve) => {
    //       https
    //         .get(link.href, (res) => {
    //           link.status = res.statusCode;
    //           link.ok = res.statusCode >= 200 && res.statusCode < 400 ? 'ok' : 'fail';
    //           resolve(link);
    //         })
    //         .on('error', () => {
    //           link.status = null;
    //           link.ok = 'fail';
    //           resolve(link);
    //         });
    //     });
    //   });
    
    //   return Promise.all(promises);
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
    console.log(validateLinks, "esto es el resultado de Vl")
      return Promise.all(linkPromises);
    }
    

    module.exports = {
      absolutePath,
      resolvePath,
      findLinksInContent,
      extractLinks,
      validateLinks,
      
    };