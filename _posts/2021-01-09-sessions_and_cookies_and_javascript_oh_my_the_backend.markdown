---
layout: post
title:      "Sessions and Cookies and JavaScript, Oh My! - A Tutorial Series"
date:       2021-01-09 14:09:28 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_the_backend
---

## Part 1: The Backend


You're here. You've made it. You're ready to create a full stack application with a Rails API backend and a JavaScript frontend. Congratulations! What features are you going to add?! Will it be responsive? Will it be secure? Will it allow for user interaction? The possibilities are truly endless. One thing you may want to add is the ability for a user to sign up and log in. You'll likely need this functionality if you want a user to be able to personalize anything or save any information. And it's not like you aren't familiar with this. If you're anything like me you have dozens, if not hundreds, of different accounts on different websites. So how would you go about adding this functionality?

When working with JavaScript, there are a couple different ways to set up user sign up and login. We’ve all worked with JSON Web Tokens and completely and fully understand how they work (jk I haven’t gotten there yet, but that is coming up soon!). There is another option though. Granted, this option only works if you can whitelist your origins. But if you’re able to do that, why not try working with sessions and cookies? I know what you're thinking. "Sessions and cookies?! I can do that? I have so much experience with those after having spent so much time working in Rails!" Yes, it can be done! Join me, won't you? I'll give you a step-by-step tutorial on how to set this up. This tutorial is broken up into a few parts because there is quite a bit to cover. We're going to start with the backend. Please keep your arms and legs inside the vehicle at all times. It's going to be a wild ride!

<iframe src="https://giphy.com/embed/JVCPcgZTYuw1i" width="480" height="271" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/lol-celebs-fallontonight-JVCPcgZTYuw1i">via GIPHY</a></p>

### Backend Maintenance

As I mentioned, I'll be using a Rails API backend (with a React frontend, but that fun will come later). Just in case you don't already have your backend set up, take a couple minutes now to do this. I'll wait...

And if you need a reminder, this is a good place to start:
* Run `rails new <app-name-backend --api>` (creates your backend)
* In your Gemfile, add bcrypt (gives you access to has_secure_password)
* Hang out in that Gemfile for just one more minute and add rack-cors (you're going to need this to allow the backend to talk to the frontend)
* Run `bundle install` to load up those gems
* Run `rails g resource user username password_digest` (this will generate a very basic users table)
* In your users model, add `has_secure_password`
* Run `rails db:migrate`

Whew! You just accomplished a lot in a matter of minutes. There's just one last thing to do. Even though we don't have the frontend set up yet, let's change the default Rails port so we don't run into any server issues when the time comes. Take a trip to your puma.rb file (you can find it in the config folder) and find this line: `port        ENV.fetch("PORT") { 3000 }`. Change that port to 3001: `port        ENV.fetch("PORT") { 3001 }`. Now your Rails API will run on localhost:3001 and there won’t be a conflict with your frontend. Hot diggity!

Okay, the basic setup is done. That was pretty painless! If that was all brand new to you, please check out some of the documentation on creating a <a href="https://guides.rubyonrails.org/command_line.html">Rails application</a> and using <a href="https://guides.rubyonrails.org/api_app.html">Rails for an API</a> before moving on.

All caught up? Great! Now let's get into the good stuff. First we want to add a couple of lines of code to ensure we can use sessions and cookies with our frontend. Do me a favor and head over to application.rb (once again, in the config folder). At the bottom of the Application class, go ahead and add these two lines of code: 

```
# configuring middleware to grab cookies
config.middleware.use ActionDispatch::Cookies

# configuring middleware to grab sessions
config.middleware.use ActionDispatch::Session::CookieStore, key: '_cookie_name'
```

We are off to a great start! Next, we need to make some changes to our cors.rb file. Remember how I had you add the rack-cors gem to your Gemfile? We're all set to use the cors.rb file now. You're welcome! Remember, <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS (Cross-Origin Resource Sharing)</a> is what allows our backend and frontend to talk to each other. 

Okay, back to cors.rb. First you’ll want to uncomment the block of code that is already there:

```
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'example.com'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

Next, you’ll want to whitelist your origins. This just means adding origins you're going to allow requests from. A ' * ' means requests can come from anywhere, in which case you won't be able to use sessions and cookies due to security, and you'll need to look for alternatives. But, if you are able to whitelist your origins, sessions and cookies are a great option. For our example, the origin will be our frontend route: `origins 'http://localhost:3000'`. Next, under resource, after the list of methods that are allowed, you’ll want to add: `credentials: true`. This will come into play later when you start writing those fetch requests and need to include credentials. The default value for this is false, and it can only be set to true if you are whitelisting your origins.

OK! All that backend maintenance is in good shape now. Ready to keep going? Be careful, we've got some twists and turns ahead!

<iframe src="https://giphy.com/embed/3SPS42CPDdxY2hCEcuc" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/disneyparks-disney-parks-curve-mine-train-3SPS42CPDdxY2hCEcuc">via GIPHY</a></p>


### Backend Routes and Controller Actions

When it comes to sessions and cookies, the heavy lifting from the backend is in the routes and corresponding controller actions. Since we're working with sessions, we're going to need a Sessions Controller. Let’s go ahead and create that. Use that trusty command line!

For right now, we'll focus on logging in an existing user, so we just need a route to log in. When a user logs in, we send a post request. It might look something like this: `post "/login", to: "sessions#create"`. By writing it this way, we have control over the name of the route. Instead of calling it "/sessions/new", we can call it something that is a bit more intuitive. You're free to name the route however you would like, but a bit of convention never hurt anyone.

That line of code tells us we're going to be directing to the create method in the Sessions Controller. We don't have the frontend completed yet, so we won't be able to test our code for a bit, but that doesn't have to stop us from writing our create method. Of course, you can do this in any order you would like. If it makes more sense to you to start with the frontend code, by all means, go ahead and do that first!

For now, let's pretend we have the frontend and a user can enter their information, and that information is successfully being sent to the backend. What would we want to do first? Come on, you've got this. You've done it before...

Yes! We want to check the database to see if the information, in this case a username, matches information that already exists in the database. The information that the user enters on the frontend will be sent to the backend via the fetch request we have yet to write, and will be available available in the params object as an object called "session". This session object consists of the key value pairs of the information inputted by the user. So we can search the database with something like this: `user = User.find_by(:username => params[:session][:username])`

And since we're dealing with user log in, we want to authenticate the password to make sure the user is who they say they are. If not, we want to alert the user that their credentials are invalid. As a whole, the create method would look like this:

```
def create
  # find the user in the database
  user = User.find_by(:username => params[:session][:username])

  # if the user is found and that user's password can be authenticated, set the user_id in the session equal to the id of the user logging in
	# render the json for that user, to be passed to the frontend
	# if the information doesn't match what is in the database, alert the user that the credentials are invalid
  if user && user.authenticate(params[:session][:password])
    session[:user_id] = user.id
    render json: user
  else
    render json: {
      error: "Invalid Credentials"
    }
  end
end
```

If everything checks out, our user will be logged in! But, of course, we're missing a huge chunk of information here. This is only what happens on the backend and this is just when a user logs in. I'm sure you have tons of questions. Where does the user input their information? How does the login form work? When the user clicks submit what happens? What happens when the user refreshes the page? What if the user needs to create an account? We'll go over all of this in the next few posts. But for now, know that you have a backend API set up for user login that you will be able to successfully pair with your frontend when the time comes. And that is no small feat. Put those arms up and celebrate!

<iframe src="https://giphy.com/embed/3a9aRPThXvHuU" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/vevo-vevo-3a9aRPThXvHuU">via GIPHY</a></p>

<br></br>

##### Sources
<a href="https://guides.rubyonrails.org/command_line.html">Rails Command Line</a>
<br></br>
<a href="https://guides.rubyonrails.org/api_app.html">Rails for an API</a>
<br></br>
<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a>
<br></br>
<a href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>

