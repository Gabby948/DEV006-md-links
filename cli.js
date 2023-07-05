#!/usr/bin/env node

const { program } = require('commander');
const mdLinks = require('./index.js');
const CFonts = require('cfonts');

program
  .version('1.0.0')
  .description('CLI for mdLinks')
  .option('-v, --validate', 'Validate links')
  .arguments('<inputPath>')
  .action((inputPath) => {
    const options = {
      validate: program.validate || true,
    };

    function printStyledText(text, color) {
      CFonts.say(text, {
        font: 'block',
        align: 'left',
        colors: [color],
        background: 'transparent',
        letterSpacing: 0.1,
        lineHeight: 0.1,
        space: true,
        maxLength: '0',
      });
      console.log();
    }

    mdLinks(inputPath, options)
      .then((links) => {
        links.forEach((link) => {
          printStyledText(`href: ${link.href}`, 'cyan');
          printStyledText(`text: ${link.text}`, 'magenta');
          printStyledText(`file: ${link.file}`, 'yellow');
          printStyledText('--------------------------', 'white');
        });

        program.reset(); // Restablecer opciones y argumentos
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

program.parse(process.argv);
