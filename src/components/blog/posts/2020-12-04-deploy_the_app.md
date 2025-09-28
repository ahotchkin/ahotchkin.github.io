---
layout:     post
title:      Deploy the App!
date:       2020-12-04 17:41:03 -0500
permalink:  deploy_the_app
---


With the Flatiron School curriculum under my belt, I have a few projects in my arsenal, some of which could even be useful to others. Of course, this is only possible if those applications are available for people to use. This got me thinking, what comes next in the journey of an application? What happens now that I’ve poured hours upon hours of hard work into building something and I'm ready to make it available to others? Up until now, once I've considered an application to be “finished” (I use quotes because I’m not sure any of my projects will ever truly be finished) I’ve moved on to the next section of the curriculum. But what happens when there is no next section? 

I was recently introduced to the term “deployment architecture”, something I was not familiar with (and admittedly am still in the very early stages of beginning to understand). As I thought about where I should now direct my attention, this seemed like a good place to start. And the more I learn about it, the more it seems like a logical next step. 


### What is Deployment Architecture?

<div class="blog-gif">
  <img src="https://media.giphy.com/media/SQgbkziuGrNxS/giphy.gif" alt="GIF of a jetpack coming out of a snail's shell and the snail taking off" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/rocket-snail-SQgbkziuGrNxS">via GIPHY</a></p>
</div>

According to <a target="_blank" rel="noopener noreferrer" href="https://docs.oracle.com/cd/E19199-01/817-5759/dep_architect.html">Oracle</a>, "a deployment architecture depicts the mapping of a logical architecture to a physical environment. The physical environment includes the computing nodes in an intranet or Internet environment, CPUs, memory, storage devices, and other hardware and network devices."

I know, this was a bit hard for me to understand as well, but if I break it down I *think* that what it’s saying is a deployment architecture maps out the environment in which your application will run. Okay, that seems simple enough. I think.

Let’s say I wanted to launch my <a target="_blank" rel="noopener noreferrer" href="https://github.com/ahotchkin/react-fitness-frontend">React Fitness Application</a> so my 1 million closest friends can use it. That’s a lot of people! So far I’ve been the only person to test and use the application, and I’m not sure how it will fare if an additional 1 million people get on board and start tracking their fitness. This is where a deployment architecture would come in handy. I would likely want to investigate what platforms are available to me that could handle all of those users at one time, along with the other features and benefits they offer (storage, database solutions, security, etc.).

It seems there are several web hosting options out there (obviously through the likes of <a target="_blank" rel="noopener noreferrer" href="https://cloud.google.com/solutions/web-hosting">Google</a>, <a target="_blank" rel="noopener noreferrer" href="https://aws.amazon.com/">Amazon</a>, <a target="_blank" rel="noopener noreferrer" href="https://azure.microsoft.com/en-us/services/app-service/web/">Microsoft</a>, etc.), and they all have multiple features that can be used individually or in conjunction with one another to give your users the best experience possible. In addition to the web hosting platform you choose, there are other elements you may want to consider for the optimal user experience, like efficiency and security.


### Load Balancing

<div class="blog-gif">
  <img src="https://media.giphy.com/media/yHKOzZnHZyjkY/giphy.gif" alt="GIF of a dog balancing a tower of dog treats on its nose" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/yHKOzZnHZyjkY">via GIPHY</a></p>
</div>

At this point I’ve obviously told all of my 1 million friends about my React Fitness Application and they are PUMPED (no pun intended). They all want to use it and they all want to use it right now. Uh oh! I need something that is going to allow all of these people to log in at once, independently from one another, without causing my application to crash and burn. This is where load balancing comes into play. It's all in the name, it balances the traffic load for you. <a target="_blank" rel="noopener noreferrer" href="https://www.nginx.com/resources/glossary/load-balancing/">NGINX</a>, just one of the load balancing options out there, describes a load balancer as a “traffic cop” that sits in front of all of your servers and routes the client requests that come in to different servers, so no one server gets overloaded with requests. This helps to maximize speed and efficiency.

When you’re looking for a load balancer to use, if your application requires a user to log in it’s best to find one that can handle session persistence. This ensures that when a user logs in, all requests from that particular user are sent to the same server so their session can persist and they don’t have to continue logging in as they move about your site. Maximum efficiency!


### Security

<div class="blog-gif">
  <img src="https://media.giphy.com/media/81xwEHX23zhvy/giphy.gif" alt="GIF of two state troopers turning and looking at the camera" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/81xwEHX23zhvy">via GIPHY</a></p>
</div>

Let’s face it, the World Wide Web can be a shady place. And a traffic cop probably isn’t going to be quite enough to handle everything. You’re going to want to make sure you have security covered at every stop. The last thing I want is for one of my 1 million friends to log in to their account and input their exercise for the day, only to find that the information they entered has been stolen and now everyone knows how many calories they burned on their morning run. Nooo! Or you know, maybe there’s a website out there where someone is entering information that is a bit more sensitive, like credit card numbers, bank account numbers, social security numbers, just all sorts of numbers.

Most web hosting services will tout their level of security and data encryption since it is such a concern these days. On top of this security, load balancers can work in conjunction with firewalls to block unauthorized access to and from your internal network. The firewalls sit behind the load balancer and, much like how the load balancer directs traffic to different servers based on capacity, they can do the same with firewalls to filter out the unauthorized users that are trying to sneak in.<sup>1</sup>


### What's next?

This is hardly the tip of the iceberg when it comes to deployment architecture, load balancing, and security. I have plenty more research to do before I'm ready to launch an application at a large scale, but I do feel like I have a better understanding of what one needs to consider before doing so. For now, my 1 million friends will have to wait. But hopefully not for long...

<div class="blog-gif">
  <img src="https://media.giphy.com/media/tXL4FHPSnVJ0A/giphy.gif" alt="GIF of a bored child tapping his fingers on a desk" />
  <p class="blog-giphy-link"><a target="_blank" rel="noopener noreferrer" href="https://giphy.com/gifs/kim-novak-tXL4FHPSnVJ0A">via GIPHY</a></p>
</div>


##### Sources
<sup>1</sup><a class="blog-source-link" target="_blank" rel="noopener noreferrer" href="https://www.cisco.com/c/en/us/td/docs/interfaces_modules/services_modules/csm/4-1-x/configuration/guide/icn/fwldbal.html#wp1037625">Cisco</a>



