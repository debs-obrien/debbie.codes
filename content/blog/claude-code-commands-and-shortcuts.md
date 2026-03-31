---
title: Claude Code Commands and Shortcuts
date: 2026-03-31
description: A guide to Claude Code's slash commands, keyboard shortcuts, and tips for a smoother workflow in the terminal.
tags: [ai]
published: true
---

When you first open Claude Code, it's not immediately obvious what commands are available to you. I spent some time today exploring the slash commands and keyboard shortcuts and found them genuinely useful for day-to-day work. Here's a quick rundown of what each one does and when you might reach for it.

## Slash Commands

### `/intro` - Setting Up Your Project Instructions

`/intro` creates a `claude.md` file where you can define instructions for how Claude should behave in your project. If you're working in a team or want consistent responses across sessions, this is a good place to start.

### `/terminal-setup` - Fixing Multi-Line Input

By default, hitting Enter sends your message immediately, which can be frustrating when you're trying to write something longer. `/terminal-setup` configures your terminal so that **Option + Enter** (or Alt + Enter on Windows) gives you a new line instead.

One thing to note: you'll need to restart your terminal app after running this for the changes to take effect.

### `/model` - Changing the Default Model

If you want to switch which model Claude Code uses, `/model` lets you do that. Straightforward, but easy to miss if you don't know it's there.

### `/usage` - Checking Your Subscription

`/usage` shows your current usage for your subscription plan. Handy for keeping track of where you are without having to leave the terminal.

### `/context` - Understanding What's in Your Context Window

This one I found particularly useful. `/context` gives you a breakdown of what's currently loaded in your conversation, with estimated usage by category:

- **System prompts**
- **System tools**
- **Skills**
- **Messages**
- **Free space**

```
┌─────────────────────────────────────────────────────────────┐
│  /context                                                   │
│  └─ Context Usage                                           │
│                                                             │
│  claude-opus-4-6 · 15k/1000k tokens (1%)                   │
│                                                             │
│  Estimated usage by category                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  ● System prompt:      5.6k tokens  (0.6%)                  │
│  ● System tools:       8.3k tokens  (0.8%)                  │
│  ○ Skills:              715 tokens  (0.1%)                   │
│  ○ Messages:             58 tokens  (0.0%)                   │
│  □ Free space:         952k tokens  (95.2%)                  │
│  ■ Autocompact buffer:  33k tokens  (3.3%)                   │
│                                                             │
│  [████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 1%  │
│   ^^^^                                                      │
│   used                              free space              │
└─────────────────────────────────────────────────────────────┘
```

It also tells you when autocompaction will happen, that's when Claude automatically trims older context because the token limit is running low. If you've ever wondered why Claude seems to "forget" something from earlier in a long session, this command helps explain what's going on.

### `/clear` - Starting Fresh

`/clear` wipes your chat history and context window. It's essentially the same as closing and starting a new Claude session. Useful when you're switching to a completely different task and don't need the previous context hanging around.

### `/ide` - Connect to Your IDE

There's a Claude Code extension for VS Code, and you can connect to it by running `/ide`. Once connected, things like git diffs will open in VS Code instead of displaying in the terminal. If you're reviewing changes regularly this is a much better experience, you get proper syntax highlighting and the familiar side-by-side diff view rather than trying to read through diffs in the terminal.

### `/resume` - Browse Previous Sessions

Type `/resume` and use the **up and down arrow keys** to browse through your previous sessions. There's also a search box so you can find a specific session across all sessions in the repo.

## Tips

### Interrupting Claude with Escape

Press **Escape** at any time to interrupt Claude while it's generating a response. If you want it to continue from where it left off, just type "go." Press Escape again if you want to stop it for good.

This is helpful when you realise partway through that you need to rephrase your question or Claude is heading in the wrong direction.

### Rewind with Escape + Escape

Press **Escape** twice to enter rewind mode. This lets you scroll back through your conversation using the **up arrow key**. When you land on the point you want to go back to, press **Enter** and you'll get a few options:

- **Restore code and conversation** - rolls back both your files and the chat
- **Restore conversation** - rewinds the chat but keeps your code as-is
- **Restore code** - reverts your files but keeps the conversation
- **Summarize from here** - condenses everything from that point forward
- **Never mind** - cancels and takes you back to where you were

This is really useful when Claude has gone down the wrong path and you want to undo a series of changes without manually reverting files yourself.

### Stash Your Prompt with Ctrl + S

This one would have saved me a lot of time if I'd known about it sooner. If you're mid-way through typing a prompt and realise you need to ask something else first, press **Ctrl + S** to stash it. Your current prompt gets set aside, you can type and submit something else, and then the stashed prompt automatically restores in the input field, ready for you to send or stash again.

If you decide you no longer need the stashed prompt, just press **Ctrl + C** to get rid of it.

Before I knew this existed, I was copying my prompt to the clipboard, typing the other thing, and then pasting it back in. Not the end of the world, but once you've done that a few times in a session it gets old fast.

### Paste Images Directly into Claude Code

Something I didn't expect from a terminal-based tool: you can copy and paste images right into Claude Code. Just copy an image and paste it into the input field, then ask questions about it. Useful for things like sharing a screenshot of an error and asking what's wrong, pasting a design mockup and asking Claude to build it, or getting help interpreting a diagram or chart.

### Bash Mode with `!`

Prefix any input with `!` to run it as a bash command directly from Claude Code. For example, `!npm run typecheck` will run your typecheck and show the output. The useful part here is that any error messages from those commands are now in Claude's context, so you can immediately ask it to help fix whatever went wrong.

You can also run long-running processes like `!npm run dev` and then press **Ctrl + B** to send it to the background. You'll see a message like:

> Command was manually backgrounded by user with ID: be96u9i91. Output is being written...

A background task indicator will appear, and you can use the **arrow keys** to navigate to it and press **Enter** to view the shell details:

```console
Shell details

Status:  running
Runtime: 2m 15s
Command: npm run dev

Output:
> dev
> react-router dev
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

From the shell details view, you can press **X** to stop the background process, or press the **left arrow key** to go back to your conversation.

This means you can keep your dev server running in the background while continuing to work with Claude in the foreground. Because the output is being captured, Claude can see what's happening with the process so if something crashes or throws an error, it already has that context and can help you debug it.

### Suspend Claude with Ctrl + Z

If you need to run a bash command outside of Claude, something you don't want in its context, press **Ctrl + Z** to suspend the process. Run whatever you need to in your terminal, then type `fg` to bring Claude back. Handy for things like checking credentials, running unrelated scripts, or anything you'd rather keep out of the conversation.

### Ending and Resuming Sessions

Press **Ctrl + C** twice to end your current session. Claude persists sessions locally, so when you exit it gives you a command to resume that session, something like `claude --resume <session-id>`. Just copy and paste it to pick up where you left off.

If you've already closed the session and didn't save the command, no problem. Open Claude Code and use the `/resume` slash command to browse your history.

If you just want to jump straight back into your most recent session, `claude --continue` does exactly that.

### Managing Permissions

When Claude needs to run something, it will ask for permission with a few options:
- **Yes** - allow it this once
- **Yes, and don't ask again for...** - allow it going forward
- **No** - block it, with the option to give a reason or suggest a different command

These choices are saved to a file called `settings.local.json` inside the `.claude` folder in your project. Inside that file you'll find a `permissions` property with an `allow` array listing everything you've approved. You can edit this manually to add commands, for example:

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm typecheck)",
      "Bash(pnpm *)"
    ],
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

Use wildcards to allow a range of commands—`Bash(pnpm *)` will permit any pnpm command. Use `deny` to explicitly block things you never want Claude to run, like `Bash(git push *)`.

Permissions aren't limited to bash commands either, they also cover things like web search and other tools.

By default, `settings.local.json` is gitignored so your permissions stay local to your machine. If you want to share them with your team, rename the file to `settings.json`.

Hope this helps you move faster with Claude. Have fun.
