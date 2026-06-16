---
layout: post
title: "I Got Skills, They're Multiplying"
date: 2026-06-16 19:59:42 -0500
permalink: i_got_skills_theyre_multiplying
---

There is no doubt that AI has changed, and continues to change, the way we write code. My average workday is hardly recognizable compared to a couple of years ago.

While some days I find myself missing the days of actually writing line after line of code, other days I find myself very excited by the things I can now accomplish in a short amount of time. Which leads me to asking the question: What can I get AI to do for me so I can direct my focus elsewhere? <i>Enter: The AI Skill</i>.

### Define 'Skills'

A skill is exactly what it sounds like: a specific task you teach an AI to do by providing proper instructions. But to build a good one, we first have to understand what it <i>isn't</i>.

A skill should be more than just a glorified script. Scripts are great and we've used them for decades, but a script runs deterministically without using any LLM tokens. When developing an AI skill, make sure you aren't just wrapping a bash script inside a prompt. Don't waste valuable, expensive tokens on something a script can do. And please, use a script when you can!

Instead, a skill should leverage cognitive capabilities. It should achieve something that would normally require developer input and critical thinking to pull off.

### Build Me Up, Buttercup

So, how do we actually build a skill? What information should we include? How do we get AI to execute something so complex without babysitting it along the way? We'll take it one step at a time.

#### Tell Me About it, Stud: The Overview

<br>

<div class="blog-gif">
  <img src="https://media.giphy.com/media/7EErFyyADmj3W/giphy.gif" alt="GIF of Olivia Newton John saying 'Tell me about it, stud.'" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/embed/7EErFyyADmj3W">via GIPHY</a></p>
</div>

Before you write a single rule, instruction, or command, you need to describe your skill's purpose. Write a brief summary covering:

- What the skill does
- Why it's useful
- When and how a developer should trigger it

Include a brief overview of the skill's phases here too. I view this section as much for the human developer as it is for the AI. It should be human-readable and clear. Even in the age of AI, documentation remains incredibly important. Don't skip it.

#### Where is this Going?: Defining the Scope

It's equally important to outline what the skill will not do. Clearly define what is out of scope today and what might be deferred to a future iteration.

Maybe certain edge cases are too complicated for a first draft, or an API integration would take too long to set up right now. Write it down. Your skill doesn't need to be perfect at first, it just needs to be useful. By drawing strict boundaries, you prevent the AI from wandering into unrelated directories or hallucinating irrelevant code fixes.

#### Help Me to Help You: Key Principles

Now we get into the meat and potatoes. Before diving into the step-by-step instructions, I like to establish a key principles section. This sets the mental stage for the AI.

When working with AI, it's important to describe the reasoning you want, not the implementation you imagine. If you want the AI to think like a developer, say that directly. For example, your principle might state: "Act as a software engineer who reasons critically about architectural changes, rather than blindly matching exact string patterns." You can provide more specific examples that the AI might find helpful, but it's very important the AI understands these are just examples to build on.

You can also use this section to define the AI's boundaries and access:

- What does the AI have access to? (The whole repo, staged files, the main branch, the current branch, etc.)
- What should the AI explicitly <i>avoid</i> doing?

This section can also serve as a gut check for you, the developer. If you're unable to define a solid principle, perhaps this is something a script could solve instead?

#### Actions and Monologues and Humans, Oh My!: The Blueprint

Once the principles are set, it's time to map out the execution blueprint. I like to think of this in three distinct sections:

`Automated Actions —> Internal AI Monologue —> Human-in-the-Loop (HITL)`

- <b style="font-weight: 600;">Automated Actions:</b> These are the predictable setup steps. This includes gathering credentials, checking for branch conflicts, running a linter, generating API keys, etc. Essentially, this is where you can run any simple commands to make sure everything is set up properly for the next step, where things start to get exciting.
- <b style="font-weight: 600;">The Internal AI Monologue:</b> Now is the time for the AI to stop, evaluate, and think about what it's doing. This is where the heavy lifting happens. The AI shouldn't just be copying examples from your documentation, it should be using those examples as a guide and applying the same logic across the codebase. This is where the skill becomes truly valuable, taking on the cognitive load a developer would usually bear.
- <b style="font-weight: 600;">Human-in-the-Loop (HITL):</b> This is your safety net. There are times when the AI should not be making a unilateral decision. You'll want to define thresholds where the AI should stop what it's doing and prompt the developer for input before proceeding and making any final changes.

#### Show Me the Money: Output and Summary

Never let a skill finish silently. If you do that, how will you know what was done and if it was done properly? Tell the AI to provide a summary of what was accomplished. This could include things like:

- The automated scripts that ran and how long they took
- A summary of code changes made
- The estimated level of risk for the changes
- Any retries or issues it ran into during execution

#### I've Made a Huge Mistake: Error Handling

<br>

<div class="blog-gif">
  <img src="https://media.giphy.com/media/5PiIuCHlkQ58Y/giphy.gif" alt="GIF of Gob from Arrested Development saying 'I've made a huge mistake.'" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/embed/5PiIuCHlkQ58Y">via GIPHY</a></p>
</div>

We're almost done, but there's one last thing to consider. What happens when things go wrong? A command might fail, a PR might reject, an API might reach a rate limit. Any number of things could cause a minor hiccup in the execution.

A good skill includes explicit rules for error handling. Should the AI attempt to read the error and self-correct on its own? Maybe sometimes. Should the AI immediately trigger a prompt to get developer input? Perhaps. This will all be error-dependent, but should be clearly defined to avoid the AI getting itself into an infinite loop and burning tokens unnecessarily.

### I Think This Is the Beginning of a Beautiful Friendship

You might read this and think, "But if I write enough skills, won't I eventually become obsolete as the developer?"

The purpose of building skills is not about replacing the developer. Developers should be able to use AI skills in conjunction with their own skills to write better, smarter code than they could before. By using a skill as a reasoning framework, you can begin to unlock the real power of agentic AI.

<div class="blog-gif">
  <img src="https://media.giphy.com/media/f41oBFWHe3uro7Inqr/giphy.gif" alt="GIF of Casablanca 'I think this is the beginning of a beautiful friendship.'" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/embed/f41oBFWHe3uro7Inqr">via GIPHY</a></p>
</div>
