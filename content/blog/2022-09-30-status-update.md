---
title: Status Update, September 2022
date: 2022-09-30
tags: []
---

Hey!

This month has been an absolute shitshow of negative emotions and helplessness.

## LAN Goodies

Up until earlier this month, I had been using `localhost:<port>` to access services on my desktop. While touching up my `unbound` + `stubby` configuration, I realized I could finally set up a domain to access local services and test servers.

### Khazad-dûm

[Moria](https://en.wikipedia.org/wiki/Moria,_Middle-earth) is my favorite place in ALL of Tolkien's works! I absolutely love the Dwarves, their lore, and Dwarven architecture. It should come as no surprise, then, that I named my local domain `khazad.dum`. Navigating to it in the browser yields a list of local services which are reverse proxies to individual subdomains. There is [Jackett](https://github.com/Jackett/Jackett), [FlareSolverr](https://github.com/FlareSolverr/FlareSolverr), [Syncthing](https://github.com/syncthing/syncthing/), and :8080, to name a few.

This worked out of the box for everything except Firefox, which parsed the domain in the URL bar as a search query since .dum is not a TLD in the IANA Root Zone Database.

Creating and setting this boolean value to `true` in `about:config` helped fix that behavior:

```
browser.fixup.domainsuffixwhitelist.dum
```

Setting all my internal services to use the new local domain instead of localhost felt great!

As a bonus, I get to access these services across my home network. There's no need to run to my desktop for everything, I can pull up `<service>.khazad.dum` on my phone, and do the things from there.

### Blocking Ads

Ad blocking is relatively easy using `unbound`. For the initial iteration, I used [Dan Pollock's hosts file](https://someonewhocares.org/hosts/hosts) and grep-awk'd it into the `unbound.conf` format. It seems to work well so far for everyone on WiFi. Not all ads are blocked, but most are. I'll be adding more domains to block as I find suitable sources. I might have to maintain my own list too. Local ads here in India absolutely prey upon the mind, naïve or otherwise. And no one should have to deal with that while browsing the Internet.

### Router (read: proprietary hell)

After this wondrous joyride, I decided it would be awesome if I could access these services from outside my home network too! I quickly set up a script to periodically keep updating the domain name pointing to my home with its dynamic IP.

This is where the fun ended. Over the next several hours, I discovered my router has a firewall that cannot be turned off (drops ICMP packets etc), and it also does not forward ports despite an entire router settings page dedicated to it. I don't know why I expected my sub-₹1000 router to be able to actually do things. Never again. The next time I buy a router, it will need to be compatible with OpenWRT, without any pitfalls.

## Multi Factor Authentication

Up until this year, I hadn't really cared about using 2FA/MFA on services I was signed up for. Mostly because I hadn't looked at the underlying tech. I had no idea what was behind the QR code, and I never bothered to check either. Thanks brain. So when I looked it up and learned it's just a URI with a token with optional arguments for non-default parameters to an algorithm that uses the current time as a source of uniqueness, I realized I didn't have to rely on closed-source apps like Google Authenticator or Authy anymore.

I use KeePassXC to manage my passwords and other credentials. I migrated all my existing services that use TOTP to my password database, and I keep adding more as and when I come across services that offer MFA. Not having to open yet another app during a login process is a win! Arguably, I should be putting my TOTP secrets in a separate database, but here's how I see it (in increasing order of security):

- No password management
- Use a password manager, but no MFA
- Use a password manager, and store MFA secrets in the same DB
- Use a password manager, but store MFA secrets in a different DB

Don't store all your eggs in one basket yada yada, but it's still better than most of the alternatives.

That's all for now. See you next month!

