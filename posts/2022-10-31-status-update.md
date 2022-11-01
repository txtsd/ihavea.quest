---
layout: layouts/post.njk
title: Status Update, October 2022
date: 2022-10-31
tags: ['post']
---
Hello!

This month went by relatively fast! Plenty of things happened, both planned and unexpected.

## Emails

I had my domain set up for emails earlier this year. I've slowly been replacing my primary email (unfortunately Gmail) across services with service specific emails. These service specific emails are going to help me find out which services are selling my information to spammers and cold-emailers, and where spammers tend to scrape my contact information from.

### Password management

This is part of a [larger](https://www.reddit.com/r/degoogle/) [de-googling](https://www.privacytools.io) [effort](https://www.privacyguides.org) that started several years ago with the migration of my Chrome-saved passwords to a password manager. I first tried [LastPass](https://www.lastpass.com) in 2015, and it was okay for a first experience, however there wasn't a Linux native client so I couldn't access my passwords unless I had a browser open. My second choice was [Bitwarden](https://bitwarden.com) which I migrated to in 2017. Bitwarden was much better than LastPass and had a client for Linux, except it was Electron based so it used inexcusable amounts of RAM to run. In 2019, I finally switched to [KeePassXC](https://keepassxc.org) with [Syncthing](https://syncthing.net). KeePassXC filled all the checkboxes I needed:

- Native client on Linux
- Standard interoperable storage format, accessible and manipulable from other platforms.
- No paywalled features
- No need to self host a service (unlike [Vaultwarden](https://github.com/dani-garcia/vaultwarden))
- Syncing the password database(s) requires a daemon, but it is FOSS and can be used to sync files and folders for other purposes too.

I've been using KeePassXC on Linux ever since, with [KeePassDX](https://www.keepassdx.com) on Android. It has been an excellent experience, and I recommend it to everyone!

## GPG Keys

With the introduction of multiple emails per service, came the need to update my GPG identity. My old GPG key was created in 2017, and was only used to sign git commits.

The [new identity](https://meta.sr.ht/~txtsd.pgp) matches my emails across code forges, and has an expiry date so I will have no choice but to get into the cycle of revoking and updating GPG keys routinely. It is used to sign commits across forges, but also to sign and encrypt emails, and possibly for authentication in the future.

## Prism Launcher

There was unneeded drama that manifested itself this month and became popular within the Minecraft community. The PolyMC team was suddenly kicked from their positions in the GitHub Organization, Discord guild, Matrix spaces, OpenCollective collective, Reddit subreddit, Weblate project, and the domain registrar. This was done by a single maintainer —[LennyMcLenngington](https://github.com/LennyMcLennington)— of [Get to the point in the COC](https://github.com/PolyMC/PolyMC/pull/601) infamy who was a part of the initial fork from MultiMC, along with [swirl](https://github.com/binex-dsk) the original forker, also of [switch to NCoC (No Code of Conduct)](https://github.com/PolyMC/PolyMC/pull/181) infamy. The rest of the team was forced to create a new GitHub Organization —[Prism Launcher](https://github.com/PrismLauncher)— and after rebranding, development basically continued like nothing had changed.

I will do a relatively detailed post about this in November.

## Hacktoberfest 2022

Like I said at the beginning of this post, this month went by pretty fast, so I wasn't able to get any Hacktoberfest contributions in initially. However, I was able to get all my Prism Launcher contributions accepted for Hacktoberfest 2022! No prizes this year, since only the initial 40k participants who completed it were awarded, but that's okay! This year's contributions felt more worthwhile than previous years'.

That's all for October. See you next month!
