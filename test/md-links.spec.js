
const {
  isAbsolutePath,
  resolvePath,
  pathExists,
  extractLinksFromMdFile,
  validateLinks
} = require('../functions');
const mdLinks = require('../index.js');
const { JSDOM } = require('jsdom');
const MarkdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const process = require('process');

// const pathInputFile = '.\\demo\\test2.md';
// const pathInputFile = 'C:\\Users\\Gabi\\OneDrive\\Escritorio\\DEV006-md-links\\demo\\test2.md';
// const pathInputDir = 'C:\\Users\\Gabi\\OneDrive\\Escritorio\\DEV006-md-links\\demo';
const inputPath = process.cwd();
// const pathInputDir = require('path').resolve();
const completePath= path.resolve(inputPath,'demo');
// Printing current directory
console.log(completePath);

// const pathInputDir = '.\\demo';
jest.mock('axios');

// Mock de la función readFileContent
// jest.mock('../functions', () => ({ readFileContent: jest.fn() }));

describe('isAbsolutePath', () => {
  test('Should return true for an absolute path', () => {
    const result = isAbsolutePath(pathComplete);
    expect(result).toBe(true);
  });

  test('Should return false for a relative path', () => {
    const result = isAbsolutePath('demo');
    expect(result).toBe(false);
  });
});

describe('resolvePath', () => {
  test('Should return the resolved absolute path', () => {
    const result = resolvePath(pathComplete);
    expect(result).toBe(pathComplete);
  });
});

describe('pathExists', () => {
  test('Should resolve with true for an existing path', () => {
    return pathExists(pathComplete)
      .then(result => {
        expect(result).toBe(true);
      });
  });

  test('Should reject with an error for a non-existing path', () => {
    expect.assertions(1);
    return pathExists('')
      .catch(error => {
        expect(error).toBe('Path does not exist');
      });
  });
});

describe('extractLinksFromMdFile', () => {
  test('debería extraer los enlaces correctamente', () => {
    const mockContent = `
      # Node.js
      Este es un [Node.js](https://nodejs.org/) de ejemplo.
    `;

    // Configura el mock para la función readFileContent
    // readFileContent.mockResolvedValue(mockContent);

    // Llama a la función extractLinksFromMdFile
    return extractLinksFromMdFile(pathComplete).then((links) => {
      // Comprueba que se hayan extraído los enlaces correctamente
      expect(links).toEqual([
        { href: 'https://nodejs.org/', text: 'Node.js', file: './demo/test2.md' },
      ]);
    });
  });
});


describe('validateLinks', () => {
  test('debería validar los enlaces correctamente', () => {
    const mockLinks = [
      { href: 'https://nodejs.org/', text: 'Node.js', file: './demo/test2.md' },
      { href: 'https://es.wikipedia.org/l,dlsdwiki/Markdown2', text: 'Markdown', file: './demo/test1.md' },
    ];

    // Configura el mock de axios para que devuelva respuestas simuladas
    // axios.get.mockResolvedValueOnce({ status: 200 }); // Enlace válido
    // axios.get.mockRejectedValueOnce({ response: { status: 404 } }); // Enlace inválido

    axios.get.mockImplementation((url) => {
      if (url === 'https://nodejs.org/') {
        return Promise.resolve({ status: 200 });
      } else if (url === 'https://es.wikipedia.org/l,dlsdwiki/Markdown2') {
        return Promise.reject({ response: { status: 404 } });
      }
    });

    // const validation = { href: "link", status: 200, ok: "ok" };
    // axios.get = jest.fn(() => Promise.resolve({ status: 200 }));

    //  console.log(typeof validateLinks(mockLinks), "verificando");
    // Llama a la función validateLinks
    return validateLinks(mockLinks).then((response) => {
      // Comprueba que los enlaces se hayan validado correctamente
      expect(response).toEqual([
        {
          href: 'https://nodejs.org/',
          text: 'Node.js',
          file: './demo/test2.md',
          status: 200,
          ok: 'ok',
        },
        {
          href: 'https://es.wikipedia.org/l,dlsdwiki/Markdown2',
          text: 'Markdown',
          file: './demo/test1.md',
          status: 0,
          ok: 'fail',
        },
      ]);
    });
  });
});


describe('mdLinks', () => {
  test.only('debería retornar un array de objetos con los enlaces encontrados en el archivo Markdown', () => {
    // const inputPath = 'C:\\Users\\Gabi\\OneDrive\\Escritorio\\DEV006-md-links\\demo\\test2.md';
    const options = { validate: true };

    // axios.get.mockResolvedValue({ status: 200 }); // Enlace válido


  //   const validation = { href: "link", status: 200, ok: "ok" };
  //  axios.get = jest.fn(() => Promise.resolve({ status: 200 }));

    return mdLinks(completePath, options).then((links) => {
      expect(links).toEqual([
        {
          href: 'https://nodejs.org/',
          text: 'Node.js',
          file: './demo/test2.md',
          status: 200,
          ok: 'ok',
        },
        {
        href: 'https://es.wikipedia.org/l,dlsdwiki/Markdown2',
        text: 'Markdown',
        file: './demo/test1.md',
        status: 0,
        ok: 'fail',
      }
      ]);
    });
  });
});