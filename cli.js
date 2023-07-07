// #!/usr/bin/env node

// const { program } = require('commander');
// const cfonts = require('cfonts');
// const mdLinks = require('./index.js');
// const {countUniqueLinks,
//   countBrokenLinks} = require ('./stats.js')

// const colors = {
//   magenta: 'magenta',
//   green: 'green',
//   yellow: 'yellow',
//   blue: 'blue',
//   white: 'white',
//   reset: 'reset',
// };


// program
//   .version('1.0.0')
//   .description('CLI for mdLinks')
//   .option('-v, --validate', 'Validate links')
//   .arguments('<inputPath>')
//   .action((inputPath, options) => {
//     const validateOption = options.validate  || true;
    

//     function printStyledText(text, colors, fontSize = 'small') {
//       cfonts.say(text, {
//         font: 'block',
//         align: 'left',
//         colors,
//         background: 'transparent',
//         letterSpacing: 0.1,
//         lineHeight: 0.1,
//         space: true,
//         maxLength: '0',
//       });
//       console.log(colors.reset);
//     }

//     const customName = cfonts.render('MDLINK', {
//       font: 'block',
//       colors: [colors.magenta, colors.green], // Colores para el degradado
//       background: 'transparent',
//       letterSpacing: 0.1,
//       lineHeight: 0.1,
//       space: true,
//       maxLength: '0',
//     });
//     console.log(`gabby`);

//     mdLinks(inputPath, options)
//       .then((links) => {
//         links.forEach((link) => {
//           printStyledText(`href: ${link.href}`, [colors.magenta, colors.green]);
//           printStyledText(`text: ${link.text}`, [colors.green, colors.magenta]);
//           printStyledText(`file: ${link.file}`, [colors.yellow, colors.blue]);
//           printStyledText('--------------------------', [colors.white]);
//         });

//         program.reset(); // Restablecer opciones y argumentos
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   });

// program.parse(process.argv);