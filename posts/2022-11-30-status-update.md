---
layout: layouts/post.njk
title: Status Update, November 2022
date: 2022-11-30
tags: ['post']
---
Hey!

This month was basically a blur, but I got a lot of things done.

## Website

The [projects](/projects) page used to be just a plaintext list. It is now fleshed out into cards with descriptions, along with website, repo, and mirror links. This was quite fun to do. I wrote little zsh functions to create git remotes, push to all remotes, and to print the links subsection for the projects' READMEs.

My [GitHub Sponsors profile](https://github.com/sponsors/txtsd/) was finally approved this month, so I added a link to that on my [about](/about) page.

## FOSS Development

I spent a lot of time contributing to FOSS projects this month.

### Progress Quest

[Progress Quest](http://progressquest.com) is a true <abbr title="Zero Player Game">ZPG</abbr> that released in 2002. It is arguably the first [ZPG](https://en.wikipedia.org/wiki/Zero-player_game), Idle RPG, and [Incremental Game](https://en.wikipedia.org/wiki/Incremental_game), which spawned amazing games in these genres like [Godville](https://godvillegame.com), [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/), [Progress Knight](https://armorgames.com/progress-knight-game/19095), and [Fallout Shelter](https://bethesda.net/en/game/falloutshelter).

I picked some low-hanging fruit to tackle: (unashamedly) [grammar and typo corrections](https://bitbucket.org/grumdrig/pq/pull-requests/1). Seemed fair since the codebase is [Delphi](https://en.wikipedia.org/wiki/Delphi_(software)), which is a dialect of [Object Pascal](https://en.wikipedia.org/wiki/Object_Pascal), neither of which I'm familiar with, except for having used Borland C++ in 2005-2006, which is only loosely related if at all. [Eric Fredricksen](https://bitbucket.org/grumdrig/) gladly accepted and merged my changes, so I made [similar fixes](https://bitbucket.org/grumdrig/pq-web/pull-requests/1) for the [web version](http://progressquest.com/play/) of Progress Quest, with added changes for accessibility, HTML/CSS, line-endings, and UTF-8 encoding.

Once that was done, I contributed the [same changes](https://github.com/rr-/pq-cli/pull/20) to [pq-cli](https://github.com/rr-/pq-cli), a CLI and TUI reimplementation of PQ in Python.

### Prism Launcher

I set up financial goals for the project on our [Open Collective](https://opencollective.com/prismlauncher), and made a [post](https://opencollective.com/prismlauncher/updates/new-goals) about it. 

A [minor change](https://github.com/PrismLauncher/PrismLauncher/pull/368) to credits that landed in [5.2](https://github.com/PrismLauncher/PrismLauncher/releases/tag/5.2).

And another [minor change](https://github.com/PrismLauncher/PrismLauncher/pull/392) to cleverly assign Java max memory on systems with low total RAM, which will land in the next release.

### Trackma

[Trackma](https://github.com/z411/trackma) is a lightweight and simple but feature-rich program for fetching, updating and using data from personal lists hosted in several media tracking websites, like [MAL](https://myanimelist.net/), [Kitsu](https://kitsu.io/), [Anilist](https://anilist.co/), [Shikimori](http://shikimori.org/), and [VNDB](https://vndb.org/).

My first contribution to Trackma was a [bugfix](https://github.com/z411/trackma/pull/630) in July 2022. I [went to town](https://github.com/z411/trackma/pull/629) on the codebase after that and made it adhere to Python and Markdown best practices, amongst other things. This was in August 2022. I had to rebase on master at one point, so that took an entire day of extra work in typical neurodivergent fashion.

This month's [changes](https://github.com/z411/trackma/pull/653) to Trackma included creating a virtual environment for development using [Poetry](https://python-poetry.org/) (a tool for dependency management and packaging in Python), and the dropping of Qt4 support since it has been EOL for several years. The change has been approved, and is awaiting one more approval to be merged.

### pydle

[pydle](https://github.com/Shizmob/pydle) is a compact, flexible and standards-abiding IRCv3-compliant IRC library for Python. I've played with this in the past to create IRC bots for various purposes. A [minor bugfix](https://github.com/Shizmob/pydle/pull/182) was required to address a python version inequality string in Poetry, so I got that done.

### Catppuccin Color Scheme for Sublime Text

After seeing a lot of my developer colleagues use and recommend [Catppuccin](https://catppuccin.com) over the past few months, I finally decided to see what the excitement was all about, and boy did I fall hard for it. I've been using [Adapta](https://github.com/adapta-project/adapta-gtk-theme)-like themes including [Arc](https://github.com/arc-design/arc-theme) since my X11 days on [Openbox](http://openbox.org). These are primarily GTK themes, so making the rest of my system look and feel like the theme required a lot of additional work like configuring `qt5ct` and `qt6ct` to use GTK styles, manually implementing colors for `.XResources` and `rxvt-unicode` which is the terminal I used at the time, and also for editors like [Sublime Text](https://www.sublimetext.com/), which can dynamically pull in a theme, but not a color scheme. These themes also only support GTK2 and GTK3, but not GTK4.

Catppuccin is a pastel theme that aims to be the middle ground between low and high contrast themes. It is an amazing community-driven effort that offers themes for a ridiculous number of applications, including but not limited to, Code Editors, System Applications, Shells, Websites, Games, Music Players, Browsers, Search Engines, Messengers, Note-taking Applications, and Terminals. There are approximately [160 repositories](https://github.com/orgs/catppuccin/repositories) for these under the Catppuccin GitHub organization at the time of writing this post.

I went down the rabbit hole of applying these themes to my <abbr title="Desktop Environment">DE</abbr> for a system-wide unified look and feel a week or so ago, and it has been absolutely amazing!

The color scheme for Sublime Text kept throwing an error every time ST was started or when the configuration was reloaded, so I decided to give it a look and found a file that only existed to create the color scheme files. It wasn't an actually part of the color scheme for ST. I submitted a [pull request](https://github.com/catppuccin/sublime-text/pull/8) to have that file removed, so everyone else using the color scheme can benefit from it too.

### PyLNP

PyLNP is a launcher for Dwarf Fortress. It has a variety of useful features to manage settings and configure the base game. It can also manage, configure, install, and run a wide variety of related content - from graphics to color schemes, and utility programs to content-replacing mods.

I used to play Dwarf Fortress a lot around 2014-2016, and I contributed [some](https://github.com/Pidgeot/python-lnp/commit/b644ef112f9e056b4c2dd2c92d4d10dde5252b65) [changes](https://github.com/Pidgeot/python-lnp/commit/70fe6beacdc04489da30b57531c4a1242fb7d6c9) to PyLNP at the time. The repo was on bitbucket at the time and used mercurial instead of git so it was kind of difficult to navigate then. It's on GitHub now and uses git so I dived right in.

This [pull request](https://github.com/Pidgeot/python-lnp/pull/191) focuses on adhering to Python standards (PEP8), upgrading `pylint` and its config file, and dropping Python 2 support. It will also feature fixes suggested by `flake8`, and I will submit another PR to manage dependencies, packaging, and a development virtual environment using Poetry, like I did for Trackma.

## Project AnimeJouhou

I'm planning to create an anime + TV shows + movies tracker à la [trakt.tv](https://trakt.tv) and [MAL](https://myanimelist.net), but built on a FOSS database of metadata: [Wikidata](https://wikidata.org). I did an initial grab of basic anime-related data from Wikidata using SparQL which is absolutely amazing! A single query to grab everything I need! I parsed it into basic html pages, and it's up for display at [animejouhou.ihavea.quest](https://animejouhou.ihavea.quest/).

As you can see, there is a LOT of missing data, so before going any further I will be working on an easy way to populate all the Wikidata entries with info from high quality sites like MAL and [AniDB](https://anidb.net). This part of the process might take the longest, but once it's done, I will focus on creating a frontend for all of that data. It will be static initially, and the plan is to have user accounts to track things via lists like Watching, Completed, On-Hold, Dropped, Plan to Watch, Interested etc.

I'm really excited about this and I hope it's something that people will find worth switching over to, to track their media.

That's all for November. See you next month!
