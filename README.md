# mdLinks Poject

## md-Links --gabby


***

##  --About.

This npm package offers a powerful solution for extracting and analyzing links within 
 Markdown files. With its comprehensive command-line interface (CLI) tool,
 you can effortlessly retrieve all the links present in a specified directory or file.
 Additionally, this package provides convenient options to validate the status of each link,
 ensuring their integrity, and generate insightful statistics about the link structure. 
 Whether you're auditing documentation, performing quality assurance, or conducting research,
 this package simplifies the process of working with links in Markdown files

##  --Route flowchart


![image](https://github.com/Gabby948/DEV006-md-links/assets/125084134/8947714d-c711-431f-9a11-8a572a6d5c7c)



##  --Installation

```
npm install md-links-gabby 
```

##  --Usage

To use the md-links-cli tool, run the following command in your terminal:

```
md-links <path> [--validate] 
```

Replace `<path>` with the path to the directory or file that contains the Markdown files you want to scan.


### --Options

Available options:

- `--validate`: Validates the status of each link.

### --Usage example

To extract and display all the links in a directory without any validation or statistics:

```
md-links /path/to/directory
```

To extract and validate the status of each link in a directory:

```
md-links /path/to/directory --validate
```

### --Information

The md-links-cli tool generates the links found in the specified directory or file. If the `--validate` option is used, it also includes the href, text, file, status, and ok of the links.
