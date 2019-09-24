---
layout: post
title:      "How Toy Story 4 Inspired My Rails Application Project"
date:       2019-09-19 20:07:55 -0400
permalink:  how_toy_story_4_inspired_my_rails_application_project
---


A few short months ago I saw a movie that changed my life. Toy Story 4 has it all. Love, friendship, life lessons, Forky. Never have I felt so many emotions in the span of an hour and 40 minutes. Well, at least not since I saw Toy Story 3. So it should come as no surprise to hear that several weeks after I saw the movie it was still on my mind. I was dying to tell anyone who would listen about the heartwarming tale. If only there was a way for me to share my thoughts and feelings on such a masterpiece with the world. I don’t know, like some sort of Rails application for movie reviews. Well, if no one else was going to create such a thing, I figured I may as well for my Rails project.

<br>

### Where to begin?

Admittedly, when I first read through the project requirements I was pretty overwhelmed.

<img src="https://media.giphy.com/media/uWL38GO7vhqkj4qd44/giphy.gif" width="480px" height="202px">

How was I even supposed to start? I knew going into it that this would be the most intense project thus far. Before I started writing any code, I thought an outline would be helpful. Knowing that I would need several models and those models would relate to each other in all kinds of ways, this was the best way to keep track of it all.

<a data-flickr-embed="true"  href="https://www.flickr.com/photos/184253453@N07/48760992796/in/dateposted-public/" title="Movie Review App Outline 8.27"><img src="https://live.staticflickr.com/65535/48760992796_c55420946b_c.jpg" width="800" height="592" alt="Movie Review App Outline 8.27"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>


With my idea in place, I was able to use my command line to create a nice skeleton for the app. You know, commands like `rails new AppName` and `rails g resource ResourceName`. The resource generator was very helpful since it generated files for the migrations, controllers, models, helpers, etc. Now that I had a nice structure for my app, it was time to implement some functionality.

There are quite a few moving parts to the app, so it isn’t really feasible to give a step-by-step overview of my process from start to finish (not that I can actually remember it all anyway). Instead, I’ll focus on a few features I was able to implement that took some time and some research (and in rare cases some banging my head against the wall).

<br>

### Testing

First things first, I really wanted to be able to test my models and validations to make sure I had everything set up properly. This was my first time writing tests so there was definitely a learning curve. My research eventually led me to the Shoulda Matchers gem, which proved to be very helpful in writing these tests. I learned so much, in fact, that I was inspired to write an entire post on <a href="http://allysonhotchkin.com/shoulda_used_shoulda_matchers">Shoulda Matchers</a> alone.

Since I included a link to another blog post, I’m all set, right? Or does that not count? Oh, I still need to write more? Fine, I’ll keep going.

<br>

### Using Partials and Helpers

By this point I had enough code written for a user to log in and see their home page, which lists out the 10 most recent reviews. It wasn’t long before I realized that this information would probably be helpful on other pages. I might not need this exact code again, but maybe I’d want to list out ALL reviews, or even just one review. And I had a strong feeling that the code to do so would probably be pretty similar to the code I already had written. Enter partials. This was my first time using partials, but boy do they help keep your code DRY. I also wanted to make sure to have limited logic in my controllers and views, so I utilized helpers as well. In the case of the reviews display, I used partials and helpers together. The tricky part was that the review information needed to change depending on the view. For example, on the user’s show page, all review information should be present (title, movie, rating, author, and content). However, if you’re on the review show page, the review title should be the header, not part of the review. Or if you’re on the reviews index page for a particular user, the user’s name should appear as the header, not within the review itself. As you can probably tell, this required a lot of conditional statements. Perfect for a helper to handle. I ended up with the following methods in my reviews helper:

```
# reviews_helper.rb

module ReviewsHelper

  def display_review_title_link(review)
    (link_to "#{review.title}", review_path(review)).html_safe + tag(:br) if !params[:id]
  end

  def display_movie_link_in_review(review)
    "Movie: #{link_to review.movie.title, movie_path(review.movie)}".html_safe + tag(:br) if !params[:movie_id]
  end

  def display_user_link_in_review(review)
    "Written by: #{link_to review.user.username, user_reviews_path(review.user)}".html_safe + tag(:br) if !params[:user_id]
  end

  def review_date(review)
    review.created_at.strftime("%B %d, %Y")
  end

  def display_review_content(review)
    params[:id] ? review.content : review.content.truncate(350)
  end

  def display_edit_and_delete_links(review)
    if current_user.id.to_s == params[:user_id] || current_user.id == review.user.id
      "#{link_to "Edit Review", edit_review_path(review)} |
      #{link_to "Delete Review", review_path(review), :method => :delete}".html_safe + tag(:br)
    end
  end
```


With all of those helper methods, my partial looked pretty clean, and I was able to render it in all applicable views:

```
# views/reviews/_reviews.html.erb

<%= display_review_title_link(review) %>
<%= display_movie_link_in_review(review) %>
Rating: <%= review.rating %>
<br>
<%= display_user_link_in_review(review) %>
<%= review_date(review) %>
<br>
<%= display_review_content(review) %>
<br>
<%= display_edit_and_delete_links(review) %>
<br>
```

<br>

### Admin Features

I waffled back and forth for quite a while on whether or not I wanted to incorporate admin users. Ultimately I decided admin would be able to interact with the app in ways regular users could not (although as it stands anyone can check off that they are an admin when they sign up, so I probably need to add some extra functionality in there…). By writing a helper method to check if a user is an admin, and calling it before applicable actions, I was able to give admin certain abilities beyond the normal functionality. For example, an admin user can add a movie to the database, while a regular user cannot.

```
# application_controller.rb

  def redirect_if_not_admin
    redirect_to user_path(current_user) if !current_user.admin
  end
```


```
# movies_controller.rb

  def new
    redirect_if_not_admin
    @movie = Movie.new
  end
```

It seemed like I had accomplished quite a bit up to this point. I must be almost done! Wait, I'm sorry, what's that? There are more requirements?! Oh dear...

<img src="https://media.giphy.com/media/J95IRJaXr7ZNm/giphy.gif" width="480px" height="269px">

<br>

### Searching and Sorting

I knew I needed some sort of scope method to meet the project requirements, and one of the suggestions was to implement a search feature. So I gave it a try. While on the index pages for movies, actors, and genres, the user has the ability to search for a movie, actor, or genre accordingly. I started with the movies, and once I had the feature working there it was pretty easy to translate to the other models. I added a scope method to my movie model:

`scope :find_by_title, -> (title) { where("title LIKE ?", title) }`

With the scope method in place, I just needed to add a search form to my view.

```
# movies/index.html.erb
  <%= form_tag movies_path, :method => :get, :class => "search-form" do %>
    <%= label_tag "Search for a movie:", nil, :class => "col-form-label" %>
    <%= text_field_tag :title, params[:title] %>

    <%= submit_tag "Search", :name => nil, :class => "btn btn-outline-secondary" %>
  <% end %>
```

And with all of that set to go, I last piece was to set some rules around the params. The `@movies` array is determined by the parameters, if any, that are passed through in the search form.

```
#movies_controller.rb

  def set_movies_array
    if params[:title]
      @movies = Movie.find_by_title(params[:title])
    else
      @movies = Movie.order(sort_column + " " + sort_direction)
    end
  end
```


Searching is great, but it got me thinking—what if a user wanted to sort the table by the individual columns rather than search for something in particular? Boy, would that be cool! (If you look closely you'll see some of the sorting helper methods above.) Lucky for me, there is a VERY helpful <a href="http://railscasts.com/episodes/228-sortable-table-columns?autoplay=true">RailsCast</a> floating around out there that explains exactly how to get this working. The one persistent little hiccup was the Average Rating column in the table, because this is actually not a column in the database. This is a dynamic value that's calculated for each movie through a separate method in my movie class: 

```
# movie.rb

  def average_rating
    self.reviews.average(:rating).round(1) if self.reviews.size > 0
  end
```

This method calculates the average rating for each movie and I’m able to display it, but thus far I have not found a way to actually sort by this information. Because this information is dynamic, it’s not terribly easy or effective to add this as a column in the database. Every time a review is written and added to the reviews database, the movies database would also need to be updated. Rather than add this to the database, I actually wrote methods that effectively sort the movies in the database by their average rating, I just couldn’t quite figure out how to implement this sort feature by clicking on the table header.

```
# movie.rb
  def self.reviewed_movies
    reviewed_movies = self.all.select { |movie| movie.reviews.size > 0 }
  end

  def self.sort_by_average_rating
    self.reviewed_movies.sort_by(&:average_rating)
  end
```
	
My hours of Google searching did seem to imply there are ways to call a function by clicking on a link using Javascript, but I’m not there yet. So as much as it pains me to say it, I had to settle for not being able to sort the movies table by Average Rating. 


<img src="https://media.giphy.com/media/5kFWIJXf8vQPrGo1w9/giphy.gif" width="480px" height="202px">

<br>

### Custom Validations

Just in case this isn’t already clear, I take movie reviews very seriously. And the last thing I want is for one person to be able to manipulate something as precious as the average rating for a movie. So I definitely needed a way to ensure that a user could only leave one review per movie. But how to do this? As Avi has suggested on numerous occasions, it seemed appropriate to write the code I wished I had. I started with something like this…

```
# review.rb
  def one_review_per_user_per_movie
    # before review.save, take the user_id from that review
    # iterate over the reviews of that user to see if the movie_id for the new review already exists in the user's reviews 
    # if review.movie_id matches the movie_id of a review that already belongs to the user, raise an error and don’t save the review to the database
  end
```

After some experimenting, I decided the best way to do this was to create an array that would contain any of the user’s reviews where the movie_id of this new review was the same as the movie_id of any existing reviews written by the user. If this array contained at least 2 reviews, that would tell me that the user had already written a review for the movie and a new review should not be created.

```
# review.rb
  def one_review_per_user_per_movie
    movie_reviews = user.reviews.select { |review| review.movie_id == self.movie_id }

    if movie_reviews.size >= 2
      errors.add(:review_id, "can't be created since you've already reviewed this movie")
    end
  end
```


<br>

### Is that everything?

No. No it is not. Truth be told, I could go on and on about the features I added, or more likely attempted to add, to this app, and what I learned along the way. But I’m afraid if I were to do that the post would never end, which means I’d never stop writing it and I’d never be able to submit my project. Even while writing this post I ended up experimenting with new/current code and found myself wanting to jump back in and update some things. While I know my code definitely isn’t perfect, it does seem to be working pretty well. Creating something from scratch that looks like it maybe, on some level, could be semi-legit is pretty cool. Time for the next section. To JavaScript and beyond!


<img src="https://media.giphy.com/media/N7b54P9EMvK24/giphy.gif" width="480px" height="270px">
