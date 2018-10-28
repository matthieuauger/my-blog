---
path: /symfony2-debug-event-dispatcher-first-contribution
title: symfony2 debug:event-dispatcher - first contribution to open-source community
date: "2015-03-06T22:12:03.284Z"
---

Some weeks ago, I was developing a personal project with Symfony2 and found myself stuck several hours. One of my PHP classes was altered during a request, I knew it was caused by a event subscriber but had a hard time finding which one.

My first thought was "Damn, a debug command would be such useful, guess I will have to wait, maybe I can raise an issue on GitHub to contribute". Then I reminded of a talk given by Kris Wallsmith in Varsaw, for SymfonyCon. His message was simple, yet powerful: « If you want to contribute to open-source, just raise your hand ».

![alt text](./raise-your-hand.png "Hands raised")

You don't need to be technical guru or a forty years old professional to start to contribute, willingness and community are often enough. So I took a leap and proposed a [Pull Request in Symfony](https://github.com/symfony/symfony/pull/10388). 6 months later, the pull request has been merged added in Symfony 2.6.

While I've been very happy to see my contribution brought to the main codebase, this contribution also had three unexpected positive impacts:

- I progressed a lot about very specific aspects of PHP, what is a callable and what types of callable exist, how to write effective tests and how to decouple my classes
- It gaves me the opportunity to have interesting conversations with people of the symfony community: Jérémy Romey, Nicolas Kregas, Stof... online, but also physically during Symfony related events
- It boosted a little my credibility and legitimity in my company

For all these reasons, I'd definitively recommand everyone who is willing to contribute to open-source to start it, to seek help from the community and finally just raise his hand to show the community he wants to be part of it.

And if you want to know how to use this `debug:event-dispatcher` command, you can simply go ahead my last article on [Theodo's blog](https://blog.theodo.fr/2015/03/debug-your-event-listeners-and-subscribers-easily-in-symfony-2/).

PS: You can also have a look on [Kris' talks](http://kriswallsmith.net/talks), they are full of wisdom.
