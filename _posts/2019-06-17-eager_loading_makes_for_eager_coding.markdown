---
layout: post
title:      "Eager Loading Makes for Eager Coding"
date:       2019-06-17 17:59:44 -0400
permalink:  eager_loading_makes_for_eager_coding
---


The deeper I get into Rails, the more I feel like a real life Hermione Granger. It’s magic! From a command line that seemingly gives you the world (and that’s not a huge exaggeration), to helper methods that make your controllers and views very easy to read, Rails can seem like the gift that keeps on giving. It’s no different when it comes to querying databases.

Through ActiveRecord you can query databases without having to write out a whole lot of SQL (if any at all), and you’ll get back Ruby objects (not just raw data). But it gets even better. Enter eager loading. Eager loading allows you to find an object of any given class, along with the associated records of that object from other classes, using as few queries as possible. That's a lot of words. Let's look at an example. Let’s say you have the following models and relationships:

```
class Movie << ActiveRecord::Base
  belongs_to :director
end
```

```
class Director << ActiveRecord::Base
  has_many :movies
end
```

And from the database you want to find the director for the first 20 movies. That doesn’t seem too bad. It would probably look something like this:

```
movies = Movie.limit(20)

movies.each do |movie|
  puts movie.director.name
end
```

In that example, 1 query is executed to get the first 20 movies. The executed SQL would look something like this:
```
SELECT  "movies".* FROM "movies" LIMIT ?  [["LIMIT", 20]]
```

Then we’re iterating through the movies array that was returned by the first query, and querying the directors database once for each movie (the id in the below statement updates accordingly each time, depending on the director):
```
SELECT  "directors".* FROM "directors" WHERE "directors"."id" = ? LIMIT ? [["id", 1], ["LIMIT", 1]]
```

So that’s 21 queries in all—1 query to find the movies, and 1 query for each movie in the movies array to find the director. This is referred to as the N + 1 queries problem. In this case it’s only 21 queries, so the application would likely be able to find this information relatively quickly. But there are more than 20 movies in the world. There are 8 Harry Potter movies alone. In fact, over 40 movies have already been released this year, and we’re not even half way through. And that’s not counting Netflix! You get it, there are a lot of movies. Can you imagine querying a database for this information for 100 movies? Or how about 1,000 movies? Honestly, who has the time?!

I said it before, but I really mean it this time: enter eager loading. A quick refresher: Eager loading allows you to find an object of any given class, along with the associated records of that object from other classes, using as few queries as possible. All through a very elegant solution: the `includes` finder method. To use `includes` to get the information we’re looking for, you’d simply write the below line of code:
```
movies = Movie.includes(:director).limit(20)
```

I know what you’re thinking—it can’t be that simple! Oh, but it is. Check it out—with this line of code, 1 query will be executed to get all of the movies, and 1—yep, that’s right, 1—additional query is executed to get the director for each movie. The SQL would look something like this:

```
SELECT  "movies".* FROM "movies" LIMIT ?  [["LIMIT", 20]]
SELECT "directors".* FROM "directors" WHERE "directors"."id" IN (<director_ids from movies array would be listed here>)
```

After the queries run, you’re able to interact with the movies array just like you would any other array in Ruby. So you can run the same code we had above, and get all of the information you’re looking for without having to query the database again:

```
movies.each do |movie|
  puts movie.director.name
end
```

By using the `includes` finder method, your application can give you the same results with way fewer queries. And you’re not limited in the number of associations you can use, either. Say, for example, every movie also has a genre and you wanted to get that as well. It’s as simple as adding the genre as one of the associations:
```
Movie.includes(:director, :genre)
```

Believe it or not, that’s just scratching the surface of Active Record’s finder methods. And to be honest I’m sure there are a lot more things you can even do with just the `includes` method. Maybe I’ll do some more research after a quick movie break.

