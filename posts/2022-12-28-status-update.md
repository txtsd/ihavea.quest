---
layout: layouts/post.njk
title: Status Update, December 2022
date: 2022-12-28
tags: ['post']
---
Hello!

A significant chunk of this month and the last were spent being sick. It took a lot out of me.

## AUR PKGBUILD linting

All the PKGBUILDs that I maintain and co-maintain on the AUR were linted this month. Bracing variables, using `sha256sum`, adding `.gitignore` files, and updating maintainer information, were among the things I did.

## Media Library Space Savings

### Videos

I came across the [SVT-AV1](https://gitlab.com/AOMediaCodec/SVT-AV1) encoder earlier this month. It encodes AV1 fast and scales across logical processors.

I converted a few H.264 and HEVC videos from my library to AV1 to see the size difference, and it went as low as 20% of the original on some files, with the mean being around 55%. That's absolutely mad!

I've begun converting my entire media library to AV1 now. It plays well on the three devices that I watch my media on.

### Images

I discovered [JPEG XL](https://jpeg.org/jpegxl/) when [Google decided to pull a Microsoft with their browser market share](https://www.youtube.com/watch?v=Jyk87VVfh9s).

The savings from converting most of my randomly selected PNG and JPG files were significant, so I decided to convert all my photos and comicbook archives to JPEG XL too. With the space savings from converting to JXL, I can compress my comicbooks into CBR instead of CBZ, and use its recovery records feature!

Unfortunately, I've come across some files that encode to a size larger than the originals though, so I've put the conversion on hold until I get to the bottom of it.

## Sieve Filters

I created my first sieve filter for my primary email this month. It took a bit of trial and error to get right, but emails from mailing-lists are now correctly sorted into specific folders as they come in.

## Pacman - Fancy progress bars

A while ago, I switched my default system font to [Fira Code](https://github.com/tonsky/FiraCode) which comes with [these nice glyphs](https://github.com/tonsky/FiraCode/blob/master/extras/progress.png?raw=true) for progress bars and spinners.

I forked pacman, implemented the ability to configure the progress bar characters, and [submitted a MR](https://gitlab.archlinux.org/pacman/pacman/-/merge_requests/29) to the pacman repo on the Arch Linux GitLab instance. Unfortunately, it was denied because it only counted as a cosmetic change, but that's okay. I will possibly maintain a fork of pacman with these changes for the foreseeable future.

It can actually read and display any Unicode character. The glyphs aren't hardcoded in. I had to make a few additional changes so the `makepkg` script wouldn't fail when encountering multibyte characters in `/etc/pacman.conf`. It was my first time hacking at C code, and while debugging the segfaults sucked, it was a good experience!

## Other things

I've also slowly been swapping my emails on services that I haven't changed them on yet, and adding configs to my [dotfiles repo](https://git.sr.ht/~txtsd/dotfiles).

That's it for December! See you next year!
