---
layout: post
title:      "Shoulda Used Shoulda Matchers"
date:       2019-09-05 12:18:05 -0400
permalink:  shoulda_used_shoulda_matchers
---


*"Dark and difficult code lies ahead. Soon, we must all face the choice between what is right and what is easy." - Albus Dumbledore*

At least it was something like that…

<br>
When it comes to writing code, there are few things more important than testing. While we all know this to be true, writing tests isn’t always easy and can be quite time-consuming. Not only that, if you’re writing them from scratch your tests can be just as error-prone as your code itself. It’s moments like these when we need to remember Dumbledore’s words and power through writing our tests. It’s the right thing to do. Luckily, there are some tools out there to make writing your tests a little bit easier. Ruby gives you access to a wonderful little gem called Shoulda Matchers. Shoulda Matchers allows you to write tests with very little code, making your tests easier to write AND read. Talk about a win-win! I’ll be the first to admit that there’s quite a bit of code in the gem and I’m still trying to break down how it all works. So I’ll save that explanation for another day. Instead, let’s just focus on an overview of what the gem allows you to do and how to add it to your code so you can start writing tests like a champ.

<img src="https://media0.giphy.com/media/44gu1V41ejJni/giphy.gif?cid=790b7611f46683b0f8d83f31f35b3c5eafa09e4a97546d38&amp;rid=giphy.gif" width="480px" height="270.72px">

In short, Shoulda Matchers gives you the ability to write very clean and concise tests to test a whole slew of things in your app (models, controllers, routes, and more). Shoulda Matchers can be used with both MiniTest and RSpec. For the sake of this post I’ll focus on RSpec because, well, I’m still pretty new to all this and I’ve never used MiniTest so I probably shouldn’t try and talk about it.

To use Shoulda Matchers with RSpec, the first thing you’ll need to do is include the gem within the test group in your gem file:
```
group :test do
  gem 'Shoulda Matchers'
end
```

Next you need to add a configuration block at the end of your spec/rails_helper.rb file (assuming you’re building a Rails app):
```
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end
```

Shoulda Matchers can be used even if you’re just using Active Record, Active Model, etc., by replacing the line `with.library :rails` with the correct library (`with.library :active_record` or `with.library :active_model` for those two examples, specifically).

Now, there are several categories of matchers provided by the gem, allowing you to test all different aspects of your app:
* Database models backed by ActiveRecord (validations and associations)
* Non-database models, form objects, etc. backed by ActiveModel
* Controllers
* Routes (RSpec only)
* Usage of Rails-specific features

For the purposes of this post (and once again, because it’s what I have the most experience with), I’ll be diving deep into the first category. 

When you’re testing database models you want to test both validations and associations. Let’s say we have classes for Movie, Actor, and Genre with the below relationships:

<img src="https://live.staticflickr.com/65535/48683698751_565301fb5e_z.jpg" width="480" height="450" alt="Shoulda Blog Post Illustration">


Your typical RSpec tests may look something like this:

```
# Movie Tests
require ‘rails_helper’

RSpec.describe Movie, :type => :model do
	
	#create an instance of a genre to test with since a movie belongs to a genre
	let(:fantasy) {
		Genre.create(
			:name => “Fantasy”
		)
	}


	#create an instance of a movie to test
	let(:harry_potter) {
		Movie.create(
			:name => “Harry Potter and the Sorcerer’s Stone”,
			:synopsis => “Meet Harry Potter, an 11-year-old boy who has spent his whole life living with his Aunt, Uncle, and Cousin, better known as the Dursleys, who simply don’t appreciate him (and that is putting it EXTREMELY mildly). As the clock strikes midnight on his 11th birthday Harry and the Dursleys are greeted by Rubeus Hagrid, an enormous man with an enormous heart, who has come to let Harry know he's been accepted to Hogwarts School of Witchcraft and Wizardry. Harry is quickly thrown into the magical world and, just as quickly, finds out he’s famous for something he doesn’t even remember. The Wizarding World is a magnificent one, but Harry will soon learn that not all witches and wizards can be trusted.”,
			:year => “2001”,
			:genre_id => fantasy.id
		)
	}

	#create a couple of actors to use for testing associations
	let(:daniel_radcliffe) {
		Actor.create(
			:first_name => “Daniel”,
			:last_name => “Radcliffe”
		)
	}

	let(:rupert_grint) {
		Actor.create(
			:first_name => “Rupert”,
			:last_name => “Grint”
		)
	}
	
```
	


Now let’s get into the tests, first testing the validations to make sure that all fields are filled in as they should be

```
    it “is valid with a title, synopsis, and year” do
	    expect(harry_potter).to be valid
    end

    it “is not valid without a title” do
    	expect(Movie.new(:synopsis => “Movie synopsis”, :year => “2000”, :genre_id => fantasy.id)).to_not be_valid
    end

    it “is not valid without a synopsis” do
	    expect(Movie.new(:title => “Movie Title”, :year => “2000”, :genre_id => fantasy.id)).to_not be_valid
    end

    it “is not valid without a year” do
    	expect(Movie.new(:title => “Movie Title”, :synopsis => “Movie synopsis”, :genre_id => fantasy.id)).to_not be_valid
    end
```


Just a quick note—we don’t need to test for the genre_id because Active Record will take care of that since we defined the has_many / belongs_to relationship.


Whew, okay, now let’s take a look at the associations tests:

```
    it “has many movie_actors” do
	    daniel_hp = MovieActor.create(:movie_id => harry_potter.id, :actor_id => daniel_radcliffe.id)
	    rupert_hp = MovieActor.create(:movie_id => harry_potter.id, :actor_id =>rupert_grint.id)
	    expect(harry_potter.movie_actors).to include(daniel_hp)
	    expect(harry_potter.movie_actors).to include(rupert_hp)
    end 


    it “has many actors through movie_actors” do
	    MovieActor.create(:movie_id => harry_potter.id, :actor_id => daniel_radcliffe.id)
	    MovieActor.create(:movie_id => harry_potter.id, :actor_id =>rupert_grint.id)
	    expect(harry_potter.actors).to include(daniel_radcliffe)
	    expect(harry_potter.actors).to include(rupert_grint)
    end
end
```

	
I don’t know about you, but I’m EXHAUSTED.

<img src="https://media.giphy.com/media/l46CBEVQjSJG6mCnC/giphy.gif" width="480px" height="269.76px">

Sure, the tests are relatively straightforward when you read through them, but it was pretty time-consuming to write them. Can you imagine if I had the smallest of typos? It might take hours to find. And that’s just dealing with the Movie model of a simple app. I’d also want to test the Actor and Genre models. And what happens if I add a User model? And if I then want to give users the opportunity to write movie reviews? You can see how it can quickly get out of hand. 

Take a look at those same tests using Shoulda Matchers:


```
# Movie Tests
require ‘rails_helper’

RSpec.describe Movie, :type => :model do

    describe “validations” do
	    it { should validate_presence_of(:title) }
	    it { should validate_presence_of(:synopsis) }
	    it { should validate_presence_of(:year) }
    end

    describe “associations” do
	    it { should have_many(:movie_actors) }
	    it { should have_many(:actors).through(:movie_actors) }
    end
end
```

…And that's it! There’s no need to create any instances to test with, Should Matchers takes care of that for you. And it provides a beautiful framework for you to write in plain English what the model SHOULD do. Dang! Not only is it a fraction of the code, but you can be much more confident in the code you are writing. And if you do happen to have a typo somewhere, at least it will be easier to find. Dare I say, the developers behind Shoulda Matchers have changed all of our lives by making the right choice and the easy choice one and the same. Albus Dumbledore would be proud.

<img src="http://giphygifs.s3.amazonaws.com/media/AOrThUuuOoDCg/giphy.gif" width="480px" height="285.474px">

For (much) more information on Shoulda Matchers, or if you are interested in perusing the source code, this <a href="https://github.com/thoughtbot/shoulda-matchers">link</a> should have what you’re looking for.

