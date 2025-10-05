---
layout:     post
title:      (e)Mail Time!
date:       2021-03-03 20:54:18 +0000
permalink:  e_mail_time
---

<div class="blog-gif">
  <img src="https://media.giphy.com/media/jGA9FxogzpaJa/giphy.gif" alt="GIF of Steve from Blue's Clues singing the Mail Time song" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/mail-jGA9FxogzpaJa">via GIPHY</a></p>
</div>

It should come as no surprise that as someone who spent several years working in direct marketing that I would want to attempt to implement some email sends within an application. Like when a user signs up for an account, it would be great to send them a welcome email. Or maybe I want to send them a weekly summary of their activity. Or remind them about something. There are plenty of times when sending an email to your users can be really valuable. Luckily, Rails has a handy tool to help with just that: Action Mailer


### Go Configure

There are a few things we need to do to implement Action Mailer. If you generated your application with the `rails new` command, you’re already in pretty good shape. You’ll notice that a folder called mailers was automatically generated in the app folder. We’ll come back to that in a second, but first there is a bit of configuration that needs to happen to make this all work.

You may be surprised to hear that you don’t need to install any gems to get this to work, but that, my friend, is part of the magic of Rails. However, there are a few other things we need to do. For one, you may want to create a new email account to use, so you don't flood your personal email with a bunch of emails that aren’t personal. And if you’re going to use Gmail, like I did, you’ll also need to update some security settings, which you may not be comfortable doing with your personal email account.

You've created your new Gmail account. Now what? The first thing you'll need to do is go to Manage My Account and then to the security settings. In the security settings you’ll see a section labeled "Less Secure App Access". Gmail recommends you have this turned off, but for our purposes we need to turn this on. Once that's turned on, stay in the security settings and find the section called "Signing in to Google". First, turn on 2-Step Verification. Once that's done, add an App password. When adding the App password, you can select "Mail" for the app and "Other" for the device. When it prompts you for a name, go ahead and call this whatever you want (something related to your app is fine, but this is just for you). This will generate a 16-digit password. Don’t lose this! You’ll need to add it to your application in a few minutes. But first, let’s configure Action Mailer in our environment.

Since we're in development right now, we’ll go to config/environments/development.rb. Action Mailer uses the Mail gem, which handles email generation and does a lot of the work for us. Thanks to this gem, the only thing you need to do to configure Action Mailer is add the below lines of code to config/environments/development.rb:

```
# /config/environments/development.rb

…
  config.action_mailer.delivery_method = :sendmail
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_options = {from: '<username>'}
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: 'smtp.gmail.com',
    port: 587,
    domain: 'gmail.com',
    user_name: '<username>',
    password: '<password>',
    authentication: 'plain',
    enable_starttls_auto: true
  }
…
```

That all looks good, but right now we have placeholder information for our username and password. We need to figure out how to include this information in a secure way. The last thing we want to do is hardcode it and then push it up to GitHub for the world to see. There are a few ways to do this securely. We’re going to use a file called local_env.yml.

In your config folder, create a file called local_env.yml. Before adding any information in this file, head over to your .gitignore file and add to the bottom `/config/local_env.yml`. This will ensure that when you push to GitHub it will ignore this file, keeping your credentials safe. Now you can go back to local_env.yml, and add your credentials. As for these credentials, you can set them up as key value pairs. For example:

```
# /config/local_env.yml

GMAIL_USERNAME: "example@gmail.com"
GMAIL_PASSWORD: “password"
```

If you head back over to config/environments/development.rb, you can use these ENV variables for your username and password, thus not exposing any of this information to the rest of the application:

```
# /config/environments/development.rb

…
  config.action_mailer.delivery_method = :sendmail
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_options = {from: ENV['GMAIL_USERNAME']}
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: 'smtp.gmail.com',
    port: 587,
    domain: 'gmail.com',
    user_name: ENV['GMAIL_USERNAME'],
    password: ENV['GMAIL_PASSWORD'],
    authentication: 'plain',
    enable_starttls_auto: true
  }
…
```

The last housekeeping thing we need to do is in app/mailers/application_mailer.rb. Where it says `default from:`, put your ENV variable: `ENV[‘GMAIL_USERNAME’]`. And that's it, our configuration is complete and we're ready to start working with Action Mailer!


### And Action…Mailer

<div class="blog-gif">
  <img src="https://media.giphy.com/media/3o6oziOWS36TN71gju/giphy.gif" alt="GIF of a man clapping a clapperboard and another man calling 'And action'" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/edbassmastershow-cmt-the-ed-bassmaster-show-3o6oziOWS36TN71gju">via GIPHY</a></p>
</div>

Generating a mailer is just like generating anything else in Rails, which means we can use the command line. For this example, we’ll generate a User Mailer, and from that User Mailer we’ll send a Welcome email when a user creates an account. If you’re familiar with Rails, you can probably guess what the command will look like. But just in case, I’ll give you a hint: `rails g mailer UserMailer`. This is going to generate a few things for you:

1. A file in your mailers folder called user_mailer.rb
2. A folder nested within your views folder called user_mailer (for any views you end up creating)
3. A couple of test files

Now that we have our mailer generated, here’s a quick overview of what we’re about to do. First, we’re going to create an action in user_mailer.rb, and along with this action we’ll create a corresponding view of the same name (Rails will know to find the view with the same name as our action, because Rails is awesome). Next, we need to figure out when we want the email sent. In our case, we want to send an email when a user signs up for an account, so we’ll edit our `create` action in our Users Controller to call our mailer action which will trigger the email send when a user is created. Now that you know what the plan is, let’s get to it.

In the UserMailer, we can create our action. Right now you're probably thinking, "I've never written any code in a mailer before, I have no idea what I'm doing!" Don't worry, it's okay! Writing code in a mailer file is very similar to writing code in a controller. Since we’re sending a welcome email, we can call this action `welcome_email`. Before writing anything in the body of the action, I like to set up my view (which is the actual email that gets sent), because then I know what information I need to have access to. When setting up your views you want to create an HTML file and a text file. This ensures that if HTML isn’t supported, your user will receive the text version of the email (instead of no email at all). Your files will be named after your action: `welcome_email.html.erb` and `welcome_email.text.erb`. The content in these two files will be exactly the same, the only difference being that in the HTML file you can include HTML tags for formatting. Maybe it will look something like this:

```
# /app/views/user_mailer/welcome_email.html.erb

<h4>Welcome, <%= @user.first_name %>!</h4>
<br>
<p>We’re so excited to have you on board. Thanks for creating an account with us.</p>
<br>
<p>See you soon!</p>
```

Your text file would just look like this:

```
# /app/views/user_mailer/welcome_email.text.erb

Welcome, <%= @user.first_name %>!

We’re so excited to have you on board. Thanks for creating an account with us.

See you soon!
```

Now that we have that all set up, we can see that the only information we need to pass from the `welcome_email` action is the user instance so we can grab the first name. Let’s write the body of our `welcome_email` action. Since we will be accessing `@user` in the view, we need to set `@user` in `welcome_email`. When we move on to our controller action, we can pass the user instance as a param to `welcome_email` and access it with `params[:user]`, so for now we can set `@user = params[:user]`. Next, we need to include the `mail` attribute where we'll set the `:to` and `:subject` (among other things, if you wish). Overall, my `welcome_email` action looks like this:

```
# /app/mailers/user_mailer.rb

…
  def welcome_email
    @user = params[:user]

    mail(to: @user.email, subject: "Welcome, #{@user.username}!")
  end
…
```

With that, we can update our controller action, knowing the only param we need to pass to `welcome_email` is the user instance.

Like we decided before, this is a Welcome email that should be sent when a user creates an account. We already have a controller action where this is happening — `create`! Right now, I have a create action that looks like this:

```
# /app/controllers/users_controller.rb

…
  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      render :new
    end
  end
…
```

Right before I redirect to `user_path(@user)`, I’m going to make a call to `UserMailer`, pass in the parameters I need, `@user` in this case, and tell that mailer to deliver my Welcome email right now. I’m going to tell it to deliver now since I’m still in development mode and testing this feature. You also have the option to tell it to deliver later, in which case it will run anything else it needs to run before worrying about sending the email. My new create method looks like this:

```
# /app/controllers/users_controller.rb

…
  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      # Update deliver_now to deliver_later before moving to production environment
      UserMailer.with(user: @user).welcome_email.deliver_now
      redirect_to user_path(@user)
    else
      render :new
    end
  end
…
```

Now, if you sign up for an account, you should receive a Welcome email! Wahoo!

You can set up emails for any event you’d like. But be careful not to bombard your users. The last thing you want is to go through all the trouble of setting up Action Mailer only for your emails to get deleted immediately, or worse, marked as spam!

<div class="blog-gif">
  <img src="https://media.giphy.com/media/Hae1NrAQWyKA/giphy.gif" alt="GIF of a spinning can of Spam" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/spam-Hae1NrAQWyKA">via GIPHY</a></p>
</div>


##### Sources

<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://guides.rubyonrails.org/action_mailer_basics.html">Rails Action Mailer Documentation</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://support.google.com/accounts/answer/185833?hl=en">Gmail App Password</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://github.com/mikel/mail/">Mail Gem</a>
<br>
<a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="http://railsapps.github.io/rails-environment-variables.html">Environment Variables</a>
