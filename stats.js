// const example = [
//     {
//       href: "C:\Users\Gabi\OneDrive\Escritorio\DEV006-md-links\demo\test1.md",
//       text: "Markdown",
//       file: "https://es.wikipedia.org/l,dlsdwiki/Markdown2",
//       status: 0,
//       ok: "fail",
//     },
//     {
//       href: "C:\Users\Gabi\OneDrive\Escritorio\DEV006-md-links\demo\test2.md",
//       text: "Node.js",
//       file: "https://nodejs.org/",
//       status: 200,
//       ok: "OK",
//     },
//   ];
//   function brokenLinks(arrayOfObjects) {
//     let broken = 0;
//     arrayOfObjects.map((element) => {
//       if (element.message === "fail" || element.status === 400 || element.status === 404) {
//         broken++;
//       }
//     });
//     return broken;
//   }
  
//   function linksTotal(arrayOfObjects) {
//     let links = 0;
//     arrayOfObjects.map((element) => {
//       if (element.href) {
//         links++;
//       }
//     });
//     return links;
//   }
  
  
//   function uniqueLinks(arrayOfObjects) {
//     let linksArr = [];
//     arrayOfObjects.map((element) => {
//       if (!linksArr.includes(element.file)) {
//         linksArr.push(element.file);
//       }
//     });
//     return linksArr.length;
//   }
  
  
//   module.exports = {
//       brokenLinks,
//       linksTotal,
//       uniqueLinks,
//   };