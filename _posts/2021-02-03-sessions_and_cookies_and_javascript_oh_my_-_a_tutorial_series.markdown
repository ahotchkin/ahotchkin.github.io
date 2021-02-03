---
layout: post
title:      "Sessions and Cookies and JavaScript, Oh My! - A Tutorial Series"
date:       2021-02-03 18:25:37 +0000
permalink:  sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series
---

## Part 5: Logging Out

Hello again! We have come a long way. At this point, our user is able to log in, see their home page, and stay logged in while navigating throughout our application. We only have a couple things left to do to complete this user experience. Today we'll focus on logging out.

Let’s get to it!

If you’ve been following along with this tutorial, then you are currently logged in to your application, with no clear way to log out. Let's fix this. To log out, we’re going to need to do some work on the frontend and the backend. I like to start with the backend, but whatever works for you will be just fine. 

<iframe src="https://giphy.com/embed/kaBU6pgv0OsPHz2yxy" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/jake-gyllenhaal-bye-kaBU6pgv0OsPHz2yxy">via GIPHY</a></p>


### Logging Out: The Backend

Just like we did for login and get_current_user, we’re going to need to create a route and a controller action. I’m going to call the route `"/logout"`, and what controller action do you think it should point to? Well, what happens when a user logs out? Do we have to delete the user from the database? No…we wouldn’t want to do that, because then the user wouldn't be able to log in again. That's right - we want to clear the session! That means our route will need to point to our `destroy` action in our Sessions Controller, and our HTTP verb will be `delete` since we are, well, deleting something: `delete "/logout", to: "sessions#destroy"`.

Boom. Our route is done. That just leaves our controller action. We know it's going to be called `destroy`, since that is what we just declared in our route. And what exactly do we need to do in this `destroy` method? It doesn’t get much simpler than this. In order to clear a session all you need to do is call `session.clear`. We're going to go just a bit further and add a notice that will show on our network tab to confirm the user was successfully logged out:

```
…
  def destroy
    # call session.clear to clear the session	
    session.clear
		# render a notice that will appear on our network tab in our browser to confirm the user was logged out
    render json: {
      notice: "Successfully logged out"
    }
  end
…
```

Believe it or not, that's all we need to do on the backend to set up logging out. On to the frontend.


### Logging Out: The Frontend

There's a bit more work to be done on the frontend than the backend, and there is more than one way to do it. We know we need something to point to our `"/logout"` route. Typically, when you're signed into an account online, you'll have access to either a button or a link to log out. This is easy enough to create. Let's take a look at both options so you can see the differences and decide what will work best in your application. We'll start with the button.


#### The Log Out Button

<iframe src="https://giphy.com/embed/GVcQtnmqBiEg0" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/pandawhale-push-button-GVcQtnmqBiEg0">via GIPHY</a></p>

Let's work in our Home component, since that what a user first sees when they log in. When creating a button to log out, you'll want it to act as a submit, so we can create a mini form with just a submit button:

```
…
  return (
    <div>
      <h1>Welcome to your Home Page, {props.currentUser.username}!</h1>
      <form>
        <input type="submit" value="Log Out" />
      </form>
    </div>
  )
…
```

If you go to your browser, you should be able to see your button. And if you try clicking on it, you'll notice that nothing happens! That's because we haven't told our form what to do yet when we submit it. If you remember back to when we created the login form, we told our form what to do `onSubmit`, and we need to do the same thing here. We'll want to write a `handleOnSubmit` function that our form calls `onSubmit`. But before we can write that function, we'll need an action to call in `handleOnSubmit`. Let’s take care of that now. We're dealing with actions, so we want to head over to actions/currentUser.js to get this done. As with all of our actions so far, we'll need a synchronous action and an asynchronous action. The synchronous action will take care of updating our store on the frontend, while the asynchronous action will connect to our API to update the backend. We can start with our synchronous action. I’m going to call this `clearCurrentUser` since we're clearing the current user from our state. And since we're clearing the user, we don't need to pass any parameters to this action, and the only attribute we need to worry about is `action.type`: 

```
export const clearCurrentUser = () => {
  return {
    type: "CLEAR_CURRENT_USER"
  }
}
```

Now, if we go to our currentUser reducer we can add a case for this action. When we clear the current user, we want to empty out the state, so we can just return `null`:

```
const currentUserReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return action.user
    case "CLEAR_CURRENT_USER":
      return null
    default:
      return state
  }
}

export default currentUserReducer;
```

Our synchronous action is all set! Let's work on that asynchronous action. I'm going to call this `logout` since that's what the user is doing. Of all our asynchronous actions, this one is going to look pretty simple in comparison. In the dispatch function that we return, we have the option to `dispatch(clearCurrentUser())` immediately, or wait until our fetch request completes. Because we don’t need to get any information from the backend prior to dispatching this action, we’ll call it first. That way, the frontend will update as quickly as possible and the user will see that they are immediately logged out. Then we'll follow up with our fetch request to the backend where we will make a call to our `destroy` action in our Sessions Controller to clear the session. All in all, it will look like this:

```
…
  export const logout = () => {
    return dispatch => {
      # immediately dispatch(clearCurrentUser() to clear the current user from the state	
      dispatch(clearCurrentUser())
      # send a fetch request to the backend to clear the session
      return fetch("http://localhost:3001/logout", {
        credentials: "include",
        method: "DELETE"
      })
    }
  }
…
```

A recap: the user will click “Log Out”, they will be removed from the state on the frontend, and the session will clear on the backend. Now that we have our action, we just need to add it to call it in `handleOnSubmit`. We need to import it into our Home component to have access, and because we’re importing an action, we also need to import `connect`:

```
import { logout } from '../actions/currentUser';
import { connect } from 'react-redux';
```

Since we're importing an action and connect, you now know we need to update our export to export `connect` and pass `mapDispatchToProps` as a parameter. We can actually use a nifty shorthand for `mapDispatchToProps` where we use object destructuring to pass the action `connect` and avoid having to write out `mapDispatchToProps`. Check this out: `export default connect(null, { logout })(Home);` Don’t forget, `mapStateToProps` is the first argument passed to `connect`, but in this case we don't have any state we're accessing so we just pass `null` as the first argument. Okay, now we have access to our `logout` action in our Home component, so we can call that in our `handleOnSubmit` function:

```
…
  const handleOnSubmit = event => {
    event.preventDefault()
    props.logout()
  }
…
```

And just make sure you’re telling your form to call `handleOnSubmit` when the button is clicked:

```
…
  return (
    <div>
      <h1>Welcome to your Home Page, {props.currentUser.username}!</h1>
      <form onSubmit={handleOnSubmit}>
        <input type="submit" value="Log Out" />
      </form>
    </div>
  )
…
``` 

And that should do it! Head over to your browser and see if you can logout of your application. Make sure to check your Redux DevTools and take a look at your state, and also check the network tab to see if you’re getting the notice you are expecting.

Nice! We have successfully logged out with our Log Out button. But maybe you don't want to use a button. Maybe you want to use a link that you can place in a NavBar or somewhere else on the page. Let's see what needs to change.


#### The Log Out Link

<iframe src="https://giphy.com/embed/26BRuuMVNwGyT0KiY" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/sdcc2016-26BRuuMVNwGyT0KiY">via GIPHY</a></p>

The good news is our action and reducer will function just the same whether we use a button or a link, so we are all set with a good majority of our code. What we need to do is give ourselves the ability to add a link to the page. To start, we need to install `react-router-dom`. We can do this via the command line: `$ npm install --save react-router-dom`.

Great, now that we have `react-router-dom`, we can import `<BrowserRouter>`. `<BrowserRouter>` is a `<Router>` and gives us the ability to navigate to different routes in our application. At the top of our application, in index.js, we can import this: `import { BrowserRouter as Router } from 'react-router-dom';`. I like to import it as `<Router>` so I can refer to it as `<Router>` in my application, but this isn't necessary. Now, in that same file, we're going to wrap our entire App in `<Router>` so we can access this anywhere we need to:

```
…
ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store } >
      # wrap App in <Router> for access throughout our application
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
…
```

This is looking great. It's time to head back to our Home component. We're able to direct our user to different routes now that our App is wrapped in `<Router>`, but right now we don't have a way to add links to allow the user to go anywhere else. Let's fix this. We need to import `<Link>`, which we also get from `react-router-dom`: `import { Link } from 'react-router-dom';`.

And just like that, we can add links to our Home component. Let's give it a shot. In our return statement, we'll add a link that directs to `"/logout"`, and when we click that link, we'll call our `logout` action (remember, we imported our `logout` action already and set everything up when we created our button, so we're in really good shape).

```
…
  return (
    <div>
      <h1>Welcome to your Home Page, {props.currentUser.username}!</h1>
      <Link to="/logout" onClick={props.logout}>
        Log Out
      </Link>
    </div>
  )
…
```

If you head over to your browser, you should see your Log Out link (you probably have to log in again since we logged out a minute ago). When you click on the link, you should see that currentUser in your state is set to `null`, and the message in the network tab indicates that you have successfully logged out!

There's just one last thing. You may have noticed that the url is now http://localhost:3000/logout. We want to redirect to our root route after we log out (or you may want to redirect to a `"/login"` route). We'll work in App.js to fix this. We need to import a few things from `react-router-dom`: <a href="https://reactrouter.com/web/api/Switch">Switch</a>, <a href="https://reactrouter.com/web/api/Route">Route</a>, and <a href="https://reactrouter.com/web/api/Redirect">Redirect</a>. A really quick overview: `<Switch>` renders the first route that matches the declared location,`<Route>` renders a component when its path matches the current URL, and `<Redirect>` will redirect your app to a new location. We'll use all of these in conjunction with each other to make sure our url on our login page is our root url. All three can be imported on one line: `import { Switch, Route, Redirect } from 'react-router-dom';`. 

In our return statement, we want to wrap all of our `<Route>`s in `<Switch>`, since `<Switch>` renders the first `<Route>` that matches a declared location:

```
…
  render() {
    return (
      <div>
        { !!this.props.currentUser ? <Home currentUser={this.props.currentUser} /> : <Login /> }

        <Switch>
        </Switch>
      </div>
    );
  }
…
```

Inside that `<Switch>`, we can define our `<Route>` and `<Redirect>` to `"/"`:

```
…
  <Switch>
    <Route exact path="/logout" render={ () => <Redirect to="/" /> } />
  </Switch>
…
```

Essentially, we're telling our application when we hit `"/logout"` redirect to `"/"`. We want to go to `"/logout"` right when a user clicks Log Out, but we don't want to stay at that route. As you build out your application and start to add more components and routes this will all become very useful.

There you have it! A user can now log in AND log out of your application, and you're equipped with two ways to set up logging out on the frontend. Either option works just fine, but you're likely going to want to have the ability to navigate to different routes within your application, so by setting that up now you're one step ahead. Next week, we'll tackle the sign up process.


<br>

#### Sources

<a href="https://www.npmjs.com/package/react-router-dom">react-router-dom</a>
<br>
<a href="https://reactrouter.com/web/api/BrowserRouter">BrowserRouter</a>
<br>
<a href="https://reactrouter.com/web/api/Link">Link</a>
<br>
<a href="https://reactrouter.com/web/api/Switch">Switch</a>
<br>
<a href="https://reactrouter.com/web/api/Route">Route</a>
<br>
<a href="https://reactrouter.com/web/api/Redirect">Redirect</a>
<br>
<a href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>
