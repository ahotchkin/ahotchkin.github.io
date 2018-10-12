---
layout: post
title:      "The (S)implicity of Ruby"
date:       2018-10-12 01:51:17 +0000
permalink:  the_s_implicity_of_ruby
---


I’ve never been one to pick up new languages very quickly. Sure, I took Spanish from 7th through 12th grade. And if I tried really hard I could probably recall a couple verb conjugation songs for you. But other than that I don’t think I retained a whole lot. The only thing I really remember is from 12th grade Spanish when we would spend our Fridays eating nachos and watching George Lopez — in English. I’m still taken right back there whenever I hear “Low Rider”. 

So needless to say I was a little apprehensive when I decided to take on the challenge of learning a programming language. It is, after all, like learning to speak a foreign language. Well, luckily for me, someone knew what they were doing when they set up the Flatiron curriculum to teach Ruby as a first programming language. As someone who knew absolutely nothing about methods, classes, or object orientation a few months ago, I’m grateful to have started with a language that, for all intents and purposes, feels pretty intuitive. However intuitive it may be though, it is still a programming language. And programming languages can be tricky.

One of the nuances of Ruby that tripped me up at first, but that I now find helpful, is that you don’t always need to spell everything out word for word. A lot of times, what you want to say is actually implied. This is the case when it comes to return values and, in some cases, method receivers.

**Return Values**

Fun Fact #1: In Ruby, if you want to return something, you don’t actually have to use the `return` keyword. This is because Ruby uses implicit returns and will always return the last line of a method. So you’d better be sure that the last line of your method is what you want returned. It’s also important to note that `puts` and `print` are very different from `return`. `puts` and `print` are used to display the results of evaluated Ruby code in your console (`puts` adds a new line after executing, while `print` does not). The return value is the value of the last statement in a method. Every method in Ruby has a return value.

```
def example_return_1
  puts “When executed, this method will puts this line of text.”
  “But it will return this line of text.”
end
```

If you `puts` or `print` the last line of a method, the return value will be `nil`. When executing code in your terminal, you will see anything that your method `puts` or `prints`, but the actual return value of the method will be `nil`. If the last line of the method is a line of code to be executed, then the method will return the executed line of code.

```
def example_return_2
  puts “When executed, this method will puts this line of text.
  “It will read this line of text”
  puts “And it will puts this line of text, then return nil.”
end
```



*A Word of Warning*

If you choose to explicitly return a line of code by using the `return` keyword, the method will stop running after that line of code. Simply put — if there is any code after the line that uses the `return` keyword, it will not run. From the little research I’ve done, it seems like most Rubyists are in agreement that it is best to take advantage of Ruby’s implicit returns.

```
def example_return_3
  puts “When executed, this method will puts this line of text”
  return “and it will return this line of text, then stop running.”
  puts “So it will never even get to read or execute this line of text.”
  “Or this line of text. Isn’t that just sad?!”
end
```


**Method Receivers**

Fun Fact #2: Ruby has implicit method receivers. That’s right, every single method you write has a receiver, even if you don’t always write it out. You can tell it’s implicit because you won’t use dot notation. For example, you’re probably very used to seeing something like this:

```
class Person
  attr_accessor :name, :age
end
```

But when you use `attr_accessor`, `self` is the implicit receiver. If you were to write `attr_accessor` with an explicit receiver and dot notation it would look like this:

```
class Person
  self.attr_accessor(:name, :age)
end
```

You’re saying the exact same thing in both examples, but the first way is just a little bit cleaner. It’s always good to remember (so I'll say it just one more time) that every method call has a receiver, whether it’s explicitly stated or not.

Whenever you have an implicit method call, the receiver is `self`. `self` is the object you’re referring to at the time (let’s never forget that everything in Ruby is an object). `self` can be a class, or `self` can be an instance of a class. There’s a chance `self` can even be something beyond one of those two things and I just haven’t gotten there yet in my educational journey (that's kind of exciting, isn't it?!).


Overall, I would say these nuances make Ruby easier to work with. At first it made things a little more confusing for me, but the more I’ve used Ruby the more I’ve begun to appreciate the (s)implicity of it. One key takeaway, and something I didn’t anticipate as I started this whole thing — the code that you’re not writing is just as important as the code that you are writing. It’s definitely all a lot to remember though. Maybe I can come up with a catchy song to help keep it all straight.
