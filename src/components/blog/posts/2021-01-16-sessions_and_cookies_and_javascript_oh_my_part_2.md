---
layout:     post
title:      'Sessions and Cookies and JavaScript, Oh My!'
subhead:    'Part 2: The Frontend Setup'
date:       2021-01-16 12:47:32 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_part_2
---


Alright! We’ve made it to our frontend. Just a quick reminder, we're working on building out sign up and login functionality using a Rails API backend and a JavaScript frontend with React and Redux. If you need some guidance on how to set up the backend, check out <a href="/blog/2021-01-09-sessions_and_cookies_and_javascript_oh_my_part_1">Part 1</a>. Since there is a fair amount of setup when it comes to using React and Redux, we’re going to spend this portion of the tutorial getting our React app set up with our Redux store and dive a little deeper into what is going on here. In the next post we’ll create our Login component and establish the necessary actions and reducers to get that working. If you already have your React frontend set up with Redux, and your store is good to go, feel free to skip ahead!

Let’s get to it! 

<div class="blog-gif">
  <img src="https://media.giphy.com/media/S8ToH7Zt8gZ4u2iClh/giphy.gif" alt="GIF of Bugs Bunny jumping up and down at the start line" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/memecandy-S8ToH7Zt8gZ4u2iClh">via GIPHY</a></p>
</div>


### create-react-app

When it comes to creating a React app, use your command line to build the shell of your app. Just run `npx create-react-app <app-name-frontend>`. This gives you all of the files you need, in a nice organized way, to get started. You'll mostly be working in the src folder. Speaking of, the first thing I like to do is set up some organization in the src folder for the files I know I'm going to create. Since I'm working in React and I know I'll be creating components, I'll need a components folder. I'm also working with Redux, which means I'll be creating actions and reducers, so I'll create corresponding folders for those as well. If you're going to get a bit more intense with your app, you may want a folder for any containers you create, but we don't need that right now.

Great! Now we have a place for everything we need to create. Staying organized from the start is going to make your life much easier down the road. But we aren't actually going to use any of this right now. First, a bit of maintenance.

### Redux Setup

Do you remember how we had to add some gems to our Ruby Gemfile. On the frontend we need to add some packages to our package.json file. Once again, you can use your command line to do so. Since we’ll be using Redux, we’ll want to add a few packages: react-redux, redux, and redux-thunk. Get back to that command line and add those in (`npm install --save <package-name>`)! 

At this point, you may be wondering, "Why Redux?" Redux is a great way to maintain your state in one place (the infamous Redux store) that your application can access from anywhere via `connect`. Each of the packages we just added gives us something that we need in order to get our Redux store up and running.

With the packages installed, let's add some code to existing files to get everything set up properly. Take a trip over to your index.js file. Here, we'll import `<Provider>` at the top of the file: `import { Provider } from 'react-redux';`. `<Provider>` is ultimately going to make your Redux store available to any nested components that are wrapped in `connect`. We haven't gotten to `connect` yet, but don't worry, that will come into play when we start to add components. For now, we need to wrap our App component in `<Provider>`. It should look something like this:

```
ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

Okay, we're done with this file for now, but we'll come back to it in a little bit for one last update.


### The Store

<div class="blog-gif">
  <img src="https://media.giphy.com/media/pQ3sptimoPVsI/giphy.gif" alt="GIF of people dancing in a line through a grocery story" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/way-club-pQ3sptimoPVsI">via GIPHY</a></p>
</div>

By now you're probably thinking, "Ally, you have been talking SO MUCH about this store. When are we going to get the store set up? I'm dying to set up the store!" Okay, then! Let's get to it! You have the option of doing this right in your index.js file, if you'd like, but I prefer to keep it separate. I'm going to create a store.js file under src.

We have a few things to add in this file, so let's start from the top. First, we'll import everything we are going to need. To start, we need a few things from Redux: `import { combineReducers, compose, createStore, applyMiddleware  } from 'redux';`. And lastly we'll need thunk: `import thunk from 'redux-thunk';`. We'll go into more detail on what each of these does in just a little bit. For now, just trust me.

Eventually, you'll also want to import any reducers you create, since this is where we'll call `combineReducers` (if you'd like, you can do this in a separate file and import one rootReducer to your store). Let's add a placeholder for our reducer since we know we'll need it soon:

```
const reducer = combineReducers({
  // list out all reducers you create that you will add to your reducer object
});
```

Here we are using `combineReducers` which we imported from Redux. This helper function pretty much does exactly as its name states: it takes all of your reducers and combines them into a single reducer that you can pass to `createStore`. 

Next up: `compose`. I'll admit, `compose` is a bit confusing for me. From what I understand, it's basically a function that allows you to enhance your store with functions, developer tools, etc. We're going to actually create a `composeEnhancer` function that gives us access to some developer tools. These tools are extremely helpful in viewing the current state in your browser. Our code will look like this: const: `const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;`.

Great! The last thing we need to do here is create our store. I know, FINALLY! For this, we'll use the `createStore` function that we imported from Redux. We're going to pass two arguments to `createStore`, both of which we just created: `reducer` and `composeEnhancer`. Let's do it!

```
const store = createStore(reducer, composeEnhancer(applyMiddleware(thunk)));
```

Let's break it down. Like I said, `createStore` takes two arguments. Our `reducer` is the first argument. Next up is `composeEnhancer` which is allowing us to enhance our store with `applyMiddleware`. `applyMiddleware` takes `thunk` as an argument, and `thunk` is the middleware that gives us the ability to make our actions asynchronous (remember, we're going to have to send some fetch requests to our backend API).

This is looking great! Let's go ahead and export our store: `export default store;`.


### One More Thing...

We're almost done! Don't forget, whenever you export something, you're going to want to import it somewhere else. Otherwise, it will go unused. Do you remember where we want to import our store? We talked about it a little while ago...

That's right! `<Provider>` makes our store available to the rest of our application, so we'll head back to index.js. Go ahead and add the code to import your store in index.js: `import store from './store.js';`.

And now for the final step. We need to pass our store as a prop. By passing store as a prop to `<Provider>`, we can make it available to all nested components, using `connect`:

```
ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store } >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

Whew! We did it! I know what you're thinking. "What does any of this have to do with adding sign up and login and functionality? We didn't create anything relevant to that..." Well, yes and no. We may not have created any components, actions, or reducers yet to sign up and log in, but without the setup we just did none of that would work anyway. So don't worry, that is all coming in the next post (or at least most of it...). But for now, be proud of the work you did and know that your frontend is now fully prepared to work with action creators and reducers. Way to go!

<div class="blog-gif">
  <img src="https://media.giphy.com/media/l3q2umc327t2nzSOQ/giphy.gif" alt="GIF of Target employees slow clapping and nodding in approval" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/target-bullseye-targetstyle-l3q2umc327t2nzSOQ">via GIPHY</a></p>
</div>


##### Sources:
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://reactjs.org/docs/create-a-new-react-app.html">create-react-app</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/redux">Redux documentation</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://react-redux.js.org/api/provider">Provider</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://redux.js.org/api/combinereducers">combineReducers</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://redux.js.org/api/compose">compose</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://redux.js.org/api/createstore">createStore</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://github.com/reduxjs/redux-thunk">Thunk</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>
