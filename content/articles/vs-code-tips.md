---
title: VS Code Tips
date: 2021-05-13
description: Tips, shortcuts and extensions to make working with VS Code easier so you can developer faster and let the tools do the job for you.
image: photo-1510751007277-36932aac9ebd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop
tags: [lifestyle, all]
provider: imgix
loading: eager
published: true
---

## VS Code Shortcuts

### Select all Words

Highlight a word and press Command D and it will select all the other instances of that word meaning you can edit that word and it will edit all of the other instances of that word at the same time. To select the next word

```bash
Command D
```

To select all words

```bash
Command shift D
```

## Multiple cursers

Press option and click to have multiple cursers. If for example you want to edit or add text in various places you can do it all at once by pressing option and clicking in the various places and then typing.

```bash
Option Click
```

### Create a File and Folder

To create a file and folder at the same time just create a new file and add the folder name followed by a slash and then the file name.

```bash
components/button.tsx
```

## VS Code Settings

### Monospaced fonts

To use coll fonts that turn your symbols into real looking symbols you can use [Fira Code](https://github.com/tonsky/FiraCode) which is free. You can [enable on VS Code](https://github.com/tonsky/FiraCode/wiki/VS-Code-Instructions) by selecting the font in the settings editor under "Commonly Used" or you can add a '.vscode/settings.json` file.

```json
{
  "editor.fontFamily": "Fira Code",
  "editor.fontLigatures": true
}
```

## VS Code Extensions

Here is a collection of some of my favorite VS Code extensions.

### Add a Spell checker

Install the [spell checker Extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) for VS Code and then add a `.vscode/cSpell.json` file with an array of words for that project that you want the spell checker to ignore. Or you can go to settings, `command ,` search for spell add add the word to the "C Spell: Dictionaries" so it will be excluded from spellchecking for all projects.

```json
{
  "words": ["Fira", "Monospaced"]
}
```

### Error Lens

If you really want to highlight your errors then the [Error Lens extension](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) will be of great help. It will add the error to the end of the line so it is really easy to see and understand what the error is.

### Add folder icons

The [Material Icon Theme extension](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) will add icons to your folder structure which is just nice and makes finding folders easy to see.

## Bracket Pair Colorizer

The [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer) makes it so much easier to see where your brackets start and end by showing them in different colors so much easier to see when things are going wrong.

### Formatting Toggle

Sometimes you just don't want to format your code or prettier is doing things that you don't want it to so being easily able to turn it on and off is really useful. [Formatting Toggle](https://marketplace.visualstudio.com/items?itemName=tombonnike.vscode-status-bar-format-toggle) is a great extension.

### VS Code Live Share

This has to be one of the best extensions out there. This gives you the ability to send a link to someone so they can jump into your VS Code editor and type away meaning they can help you debug your code. [VS Code Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) is a great way to pair program and you have have numerous people join the session.

### Search Node Modules

This is one I have only recently started to use and it has been a life saver for when you have to debug anything inside node modules folder. [Search Node Modules](https://marketplace.visualstudio.com/items?itemName=jasonnutter.search-node-modules) allows you to easily navigate the file inside your project's node_modules directory.

### Tailwind Intellisense

Of course if you are a TailwindCSS fan like me then this is a must. [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) gives you advanced features such as autocomplete, syntax highlighting, and linting.

## Conclusion

Of course there are many other extensions that I have in use some of them are installed and probably never used but for sure the above are some of my favorite and ones I use all the time. Feel free to share yours with me on [twitter](https://twitter.com/debs_obrien). Maybe there is a cool extension out there that I am missing.
