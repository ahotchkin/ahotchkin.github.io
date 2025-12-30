---
layout: post
title: 'Planning Your Route'
subhead: 'Choosing a React Router Implementation'
date: 2025-12-29 19:56:35 -0500
permalink: planning_your_route
---

Hello! It's been a while. How have you been? Things have been busy over here! I actually just finished building this lovely portfolio you are checking out. Finally, I have a place to showcase all of my work that I've done. And what a fun experience it was, traveling down memory lane. I learned so much along the way, spending countless hours creating a context for my blog posts that could be accessed globally, updating my projects to the newest version of Rails and running them locally, designing CSS that looks good on desktop _and_ mobile, and so much more. After all of that hard work, I finally deployed! It was an incredible feeling. I couldn't stop navigating through my portfolio, admiring all of my hard work. I was particularly proud of redesigning my blog and wanted to share that with friends. Some folks hadn't ever heard the story of how and why I made the switch from Advertising to Software Engineering, so I shared the link to that post with a few people. Shortly after, the texts started flowing in. "I don't see anything!" one friend exclaimed. "I'm getting a weird error, what's that about?" said another. My stomach dropped. The dreaded 404. What was wrong? I was so confused. Everything had been working fine for me. I'd go to <a href="https://allysonhotchkin.com">allysonhotchkin.com</a> and seamlessly navigate to different areas of my portfolio. But it turns out, if I tried to go directly to a route other than the root, I'd get that same 404. My work was not done.

<img class="blog-img" alt="Log in / log out flow" src="/images/router_blog_404.png" width="960" height="350">

That's when I learned about the difference between `BrowserRouter` and `HashRouter`.

### React Router

Before we get into specific details of `BrowserRouter` vs. `HashRouter`, a quick note on React Router. If you're building a React application with multiple views, you'll need it to handle navigation.

The high-level options are:

- `MemoryRouter`: Keeps history in memory, but does not write to the address bar (great for testing or React Native).
- `NativeRouter`: Specifically for mobile apps built with React Native.
- `StaticRouter`: For apps where the location never changes (like Server-Side Rendering).

But today’s show is all about the two heavyweights: `BrowserRouter` and `HashRouter`.

### BrowserRouter

I initially built my entire application using `BrowserRouter`. It’s the industry standard because it produces clean URLs like `allysonhotchkin.com/blog`.

#### How does it work?

`BrowserRouter` uses the HTML5 History API to keep the UI in sync with your URL without a full page reload. It relies on three specific events:

- `pushState`: Adds a new entry to the browser history stack.
- `replaceState`: Updates the current history entry (perfect for things like loading states where you don't want the user to click "back" into them).
- `popState`: Triggered when the user moves through history using the "back" or "forward" buttons.

`BrowserRouter` intercepts a user's click, triggers the appropriate event to change the URL _without asking the server for a new page_, and tells React to show the correct UI.

#### Why didn't it work for me?

Remember that part about not asking the server for a new page? That works perfectly as long as you stay within the app. But the moment a user clicks a direct link to `allysonhotchkin.com/blog` or hits refresh, the browser _does_ ask the server for a new page.

Because I’m hosting on GitHub Pages (a static host), the server looks for a physical folder named `/blog`. When it doesn’t find one, it gives up and throws a 404. It doesn't have the "intelligence" of a dynamic host to realize it should just serve the main `index.html` file and let React handle the rest.

### HashRouter

After seeing 404 after 404, it was time for a solution. Enter `HashRouter`.

<div class="blog-gif">
  <img src="https://media.giphy.com/media/xTiQyw99MYXMazEZoc/giphy.gif" alt="GIF of Jimmy Fallon saying 'HashTag'" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/embed/xTiQyw99MYXMazEZoc">via GIPHY</a></p>
</div>

#### How does it work?

Unlike `BrowserRouter`, `HashRouter` doesn't rely on the History API events to keep the UI in sync with the URL. Instead, it updates the `window.location.hash`, which adds that characteristic `#` to your URL (e.g., `#/blog`). The browser then fires a `hashchange` event, which the router listens for to trigger a re-render.

#### Why _did_ it work for me?

The magic of the hash is that browsers ignore everything after the `#` when talking to a server. When a user visits `allysonhotchkin.com/#/blog`, the browser only asks GitHub Pages for the root (/). GitHub finds the `index.html` at the root, sends it over, and then React Router looks at the hash to figure out it needs to show the Blog component.

To put it more simply, think of `BrowserRouter` as a personal stylist, and `HashRouter` as your standard department store. If you're looking for a t-shirt that can be found at the store, great, no problem, you're all set! But if you are looking for a red shirt with green polkadots and fur around the collar that can't be found in the store, your stylist can whip that up for you in no time.

### The Trade-off

GitHub Pages felt like the best host for my portfolio. While I could have explored using a dynamic host, I don't think the payoff would have been worth it. The trade-off? My URLs don't look as clean as they could (especially with anchor links like `/#/projects#projects`). But one very important lesson I've learned over the last few years is that code doesn't always have to be perfect—it just has to work. Ask yourself, is the time and effort I will putting into fixing something (often something small) worth it? Or is it better to put a bow on your project, share it with the world, and move onto the next thing? Like getting your blog back up and running after a few years off...

<img class="blog-img" alt="Log in / log out flow" src="/images/router_blog_success.png" width="960" height="350">

##### Sources

<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://v5.reactrouter.com/web/api">React Router Web API Docs</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://reactrouter.com/6.30.2/start/concepts">React Router Main Concepts</a>
