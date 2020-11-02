---
layout: post
title:      "How Liberty Mutual Insurance Inspired My Sinatra Application Project"
date:       2019-02-26 22:36:43 -0500
permalink:  how_liberty_mutual_inspired_my_sinatra_application_project
---


After seven years of working at an ad agency on an insurance account, it’s hard to forget some of the knowledge nuggets that I scooped up along the way. Like Renters Insurance, who knew that was even a thing? Okay fine, a lot of people, but I didn’t. Apparently it’s also a good idea to keep track of your home inventory. That way, in case anything should happen, you’ll have a log of what you own and you’ll know the value. That’s probably what led me to creating a Home Inventory Application for my Sinatra project. 

Once again, I found one of Avi’s video walkthroughs to be extremely helpful in getting started. With his guidance I was able to build the skeleton of an app (you know, with a Gemfile, Rakefile, config.ru, and whatnot). After that I had to get down to business and figure out the models I would need and their relationships to each other. I knew I would at least have a User model and an Item model. This would satisfy the relationship requirements since a user has many items and an item belongs to a user. That’s great and all, but I knew in my heart that my real dream was to incorporate a Category model, where an item could have many categories and a category could have many items. “But, Ally,” they would say, “that means you’ll have to have a joins table to connect items and categories.” I think Walt Disney said it best, “If you can dream it, you can do it.” But I had a ways to go before I could think about adding that third model. First I needed to worry about users and items.

So I set about creating the necessary migrations and models. Once I had all that in place it was time to get down to business - in other words the “V” and “C” of “MVC”. I started out with three different controllers - an `application_controller` to handle some of the common configuration settings and a couple helper methods, a `users_controller` to allow a user to sign up for an account and log in and out, and an `items_controller` to allow a user to first create items, and if they so desire, view, update, and delete those items.

Let’s talk about the `application_controller` for a minute. This is where I set the views, enabled sessions, set my `session_secret`, and told my app that I was going to need to `use Rack::Flash`. I also created two handy helper methods that would 1. Allow me to easily check if a user was logged in, and 2. Confirm that any information being displayed belonged to the current user:

```
helpers do
  def logged_in?
    !!session[:user_id]
  end

  def current_user
    User.find(session[:user_id])
  end
end
```


Now that I had a solid base, my other controllers could inherit behaviors from my `application_controller`. Next on my list was the `users_controller`. Like I said, the main purpose of this controller would be creating and persisting account information to a database, and allowing users to log in and log out. There were a few things I wanted to make sure of:
1. A user wouldn’t be allowed to create a username that already existed
2. A user would be logged in automatically after signing up
3. A user would be able to securely create a password

The first task was relatively easy to accomplish. In my `post ‘/signup’` route the first thing the program checks for is if the username already exists. If it does, the user will need to enter a new username to create an account. Don’t worry, you’ll see this code in just a second. Keep reading!

My `post ‘/signup’` route is also where I satisfied the second requirement. As long as the user enters a unique username, email, and password, the program will then create a new User instance and persist it to the database. The application will then take the id of the new User instance and set it equal to `session[:user_id]`, thus logging the user into the application. When all was said and done I ended up with a `post ‘/signup’` route that looked a little something like this:

```
post '/signup' do
  # the below code searches the database to make sure the username doesn’t exist
  # if it does, the user will see a message that will instruct them to enter a new username
  if User.find_by(username: params[:username])
    flash[:message] = "This username is taken. Please enter a new username."
    redirect “/signup”
  else
    # if the params hash contains the necessary information, the User instance will be created and saved to the database
    # if the user instance is saved to the database, the program logs them in by setting session[:user_id]= user.id
    user = User.new(username: params[:username], email: params[:email], password: params[:password])
    if user.save
      session[:user_id] = user.id
      redirect “/items"
    else
      flash[:message] = "Please enter a valid username, email, and password to create an account.”
      redirect “/signup"
    end
  end	
end			
```


My third and final wish would require a little more outside help. Enter BCrypt. BCrypt is a Ruby gem that, in short, will store a salted, hashed version of a user’s password in a database. To put it simply, the password a user enters will be manipulated in such a way that it can’t be un-manipulated (that’s the hashing part). And to take it one step further, a salt, or a random string of characters, is also added to the hash. That way, if two users happen to create the same password they’ll still end up with different hashes in the database. Three cheers for security!

<iframe src="https://giphy.com/embed/10NPdN6z9vTYWI" width="480" height="214" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cheezburger-police-10NPdN6z9vTYWI">via GIPHY</a></p>

Since users could now create an account and log in, it was time to work on the `items_controller`. I knew that within each route I wanted to first check to make sure the user was logged in before proceeding. Good thing I created that `#logged_in?` helper method! As for the routes themselves, users should be able to create, read, update, and delete items. Prior to starting this project, I put together this handy little chart to ensure I created the necessary routes:

<img src="https://c2.staticflickr.com/8/7815/33348685738_97c453f5ec_c.jpg" width="800" height="313">

This was going great! So great, in fact, that the time had come to attempt the impossible. Okay, that’s a little dramatic. What I wanted to do was very possible, but also slightly challenging. It was time to add a third model to my application. Remember that Category model I wanted to add to help sort a user’s items? As it turns out, “category” happens to be a Rails keyword and ended up causing some trouble. Minor roadblock, I’d just create a Group model instead. A group could have many items, and in turn, an item could have many groups. Let’s say a user has an item called Couch and they want to store it in a group, but they are torn between the Living Room group and the Furniture group. Thanks to this many-to-many relationship, they don’t have to choose!

But let us not forget that whenever we see a many-to-many relationship, a joins table must be nearby. I created an ItemGroups table along with the corresponding model. Items have many item_groups, and many groups through item_groups. Similarly, groups have many item_groups, and many items through item_groups. And last, but most certainly not least, users have many groups through items.

The trickiest part of this new addition was updating the `items_controller` and  views to take it into account. Within the items new and edit views, I added a checkbox for all of the current user’s existing groups. The user has the option of checking off anywhere from zero to all existing groups, in addition to creating a new group:

```
<% if !@groups.empty? %>
  <label>Select an existing category:</label>

  <br>

  <% @groups.each do |group| %>
    <input type="hidden" id="hidden" name="item[group_ids][]" value="">
    <input type="checkbox" id="<%= group.name %>" name="item[group_ids][]" value="<%= group.id %>"><%= group.name %></input>
    <br>
  <% end %>

  <br>

  <label for="group_name">And/or create a new category:</label>
  <input type="text" id="group_name" name="group_name">
<% else %>
  <label for="group_name">Create a new category for this item:</label>
  <input type="text" id="group_name" name="group_name">
<% end %>
```

All that was left to do now was update the `post ‘/items’` and `patch ‘/items’` routes so that when an item is created/updated any groups the user selects are associated with that item:

```
post '/items' do
  if logged_in? && !params[:item_name].empty? && !params[:cost].empty?
    item = Item.new(name: params[:item_name], cost: params[:cost], date_purchased: params[:date_purchased])
    item.user_id = current_user.id

    # code below is required to allow a user to create an item without selecting an existing category
    groups = current_user.groups
    if !groups.empty?
      item.group_ids = params[:item][:group_ids]
    end

    if !params[:group_name].empty?
      item.groups << Group.create(name: params[:group_name])
    end

    item.save
    flash[:message] = "Item successfully added."
    redirect "/items"
  elsif logged_in? && params[:item_name].empty? || logged_in? && params[:cost].empty?
    flash[:message] = "Please enter a name and cost for the item."
    redirect "/items/new"
  else
    redirect "/login"
  end
end
```

Now, I’m sure my code could use some refactoring. I did run into a couple issues and had to get a little creative (like figuring out how to allow a user to create an item without selecting an existing group), but the functionality is there. It’s no surprise that completing this project has been a very educational experience. I not only became much more well-versed in Sinatra and ActiveRecord, but also in Googling the right questions. Now that that’s done, I guess I’ll go buy a couch or something so I can add it to my Home Inventory.

<iframe src="https://giphy.com/embed/2OP9jbHFlFPW" width="480" height="307" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/friends-2OP9jbHFlFPW">via GIPHY</a></p>


