---
layout:     post
title:      'Sessions and Cookies and JavaScript, Oh My!'
subhead:    'Part 7: Let’s Serialize!'
date:       2021-02-15 15:18:37 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_part_7
---


We’re back! Let’s jump right into it. We currently have an application where a user can sign up, log in, view their homepage, and log out. As far as functionality is concerned, we have it all. Today we’re going to make our application a bit more secure.

Do me a favor, and go log into your application. Now go to your Redux DevTools and check out the state. You should see your currentUser and all of its attributes, including the password_digest. This is not great. Actually, this is really really terrible. Like really bad. We are currently exposing our user's password to the frontend. I don't even want to think about what could happen if this information were to end up in the wrong hands.

<div class="blog-gif">
  <img src="https://media.giphy.com/media/YU0j0j92jLdU4/giphy.gif" alt="GIF of Leslie Knope from Parks and Rec saying 'Oh, this is bad.'" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/YU0j0j92jLdU4">via GIPHY</a></p>
</div>

This is happening because when we grab our user instance from the backend we are grabbing all attributes with it. There must be a way to control what information we take from our database and display on the frontend. Guess what! There is!


### Serialization

We’re going to use a process called serialization. You may be thinking, "What is serialization?". That's a great question! <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Serialization">Serialization</a> is the process of taking a data structure or object and translating it into a format that can be stored so that it can be reconstructed later. You're probably thinking, "How the heck will I be able to do that?!" Luckily, to help us with this process, we can use a serializer. As always, there are several options out there. We’re going to work with a gem called <a target="_blank" rel="noopener noreferrer" href="https://github.com/jsonapi-serializer/jsonapi-serializer">jsonapi-serializer</a>.

<div class="blog-gif">
  <img src="https://media.giphy.com/media/3o85xKRIokv92FRo52/giphy.gif" alt="GIF of a puppet getting hit in the face with a lot of cereal" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/darkigloo-breakfast-cereal-puppet-3o85xKRIokv92FRo52">via GIPHY</a></p>
</div>

To start, we want to install the gem. Add `gem 'jsonapi-serializer'` to your Gemfile and run `bundle install`. 

With our serializer installed, we can now generate a serializer. Don’t be nervous, a serializer is just a class, which you are totally familiar with. And through the beauty of Rails we can generate our serializer just like we would generate anything else (models, controllers, resources, etc.). The command will look like this: `rails g serializer ModelName attributes`. In our case, we want to create a serializer for our User model, and the only attribute we want to include is username. Remember, password is an attribute of User, but that's the information we don’t want our frontend to have access to, so we won’t include it in our serializer. Our command will look like this: `rails g serializer User username`. If you run that and head over to your code editor you’ll see that within your app folder you now have a serializers folder, and within this folder you have a file called user_serializer.rb. user_serializer.rb should look like this:

```
class UserSerializer
  include JSONAPI::Serializer
  attributes :username
end
```

There is quite a bit you can do within your serializer to control the information that is translated and how that information is displayed, but for now we are working with a pretty simple model and just one attribute, so we can save that for another day (or maybe just later on in this post…).

You’re probably asking yourself, "How can we use this serializer to control the information that is passed to the frontend?" Again, another great question! First, let’s think about what part of the backend has control over the information that gets passed to the frontend. You got it, that would be the controller! So we are going to want to change something in our controller. Let’s start with our Sessions Controller. In our create method we are creating a user instance and rendering that user as JSON:

```
…
  def create
    user = User.find_by(:username => params[:session][:username])

    if user && user.authenticate(params[:session][:password])
      session[:user_id] = user.id
      render json: user
    else
      render json: {
        error: "Invalid Credentials"
      }
    end
  end
…
```

The line we specifically want to be looking at is `render json: user`. We don’t just want to render the user as JSON. We want to create a new instance of UserSerializer and pass the user instance we've created as the parameter. This will ensure that the only information the frontend receives regarding the user is what we have included in our UserSerializer. Change that line to: `render json: UserSerializer.new(user), status: 200`. Before you go to your browser to see if anything has changed, you’ll want to restart your Rails server. Any time you add a serializer you need to restart your server in order for it to recognize this new serializer. Okay, once you’ve done that, head over to your browser. If you’re logged in to your application, log out and then log in again. This time, in the Redux DevTools state you should see something a bit different. I now see my currentUser instance with an attribute of data. Data has three attributes: id, type, and attributes, and attributes has one attribute of username. I don’t see any password or password_digest! That’s wonderful! We’ve successfully controlled the information that is getting passed to the frontend. 

You can check out all of the methods you have in your Sessions Controller and Users Controller. Anytime you are rendering an instance of `user` or `current_user`, you can pass this as a parameter to UserSerializer.new to control the information being sent to the frontend. Go ahead and do that now.

One last thing we’ll want to do here is update our frontend to make this new JSON object a bit easier to work with. Previously, our currentUser object had all attributes available at the top level (id, username, and password). Now if we want to grab the username we have to go to `currentUser.data.attributes.username`. We can make this a little easier for ourselves with a couple minor changes to the frontend.

In actions/currentUser.js we just need to find anywhere where we are dispatching `setCurrentUser`, and instead of passing in `json` we’ll pass in `json.data`. This will automatically get us one level deeper into that user object so there will be less work to do when we need to access the user’s information. Now that we've updated that head back to your browser. In the state you can see that currentUser no longer has an attribute of data, and instead has attributes of id, type, and attributes. Great! Except for one thing. Take a look at the welcome header on the page. The currentUser’s username is no longer displayed. What happened? If you go to your Home component, you’ll notice your header displays `props.currentUser.username`. If you check out the state in the Redux DevTools, you’ll see that username is an attribute of attributes, so you need to change `props.currentUser.username` to `props.currentUser.attributes.username`. And viola! Our username is displayed again.


### What else can we do?

You may be wondering, "What else can I do with serializers?" You are full of great questions today! There is so much you can do to control the data that is being sent to the frontend. We’ll go over a quick example, just to give you an idea. Let’s say your user had attributes for first name and last name, but on the frontend, you just wanted to display this as full name. With a serializer you can do that! I’m not going to go through a detailed code along, but I will walk you through the steps if you want to give it a shot.

For this example, we're just going to work on the backend. First, you would need to add columns to your Users table for `first_name` and `last_name` and run `rails db:migrate`. If you drop into your Rails console you can add a `first_name` and `last_name` to the user instance you’ve been working with. In the Redux DevTools, you’ll notice that you don’t see any changes in your state. That’s because even though we've added this information to the user instance, we haven't changed anything in UserSerializer, so UserSerializer is still only sending username. If you add `:first_name` and `:last_name` to the list of attributes in UserSerializer you will see those populated in the state in the browser. Now let’s try to display the full name. We’re going to create a custom attribute called `full_name`, and this attribute is going to be a block that combines the `first_name` and `last_name` of our user object. Overall, my UserSerializer currently looks like this:

```
class UserSerializer
  include JSONAPI::Serializer
  attributes :username, :first_name, :last_name

  # create a custom attribute called :full_name
  attribute :full_name do |object|
    "#{object.first_name} #{object.last_name}"
  end
end
```

Now, if I head over to my browser and refresh the page, my state includes an additional attribute of `full_name` that is the combined `first_name` and `last_name` of my currentUser. How cool! This is just a minor glimpse into what you can do with serializers, but hopefully shows you how useful they can be. The real important takeaway here is that you are no longer passing sensitive information to the frontend, which is extremely important. 

<div class="blog-gif">
  <img src="https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif" alt="GIF of Borat giving two thumbs up" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/primevideo-2020-borat-subsequent-moviefilm-Od0QRnzwRBYmDU3eEO">via GIPHY</a></p>
</div>

We are in the home stretch. After a bit of refactoring next week, our functionality will be complete!


##### Sources

<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Serialization">Serialization</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://github.com/jsonapi-serializer/jsonapi-serializer">jsonapi-serializer</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>
