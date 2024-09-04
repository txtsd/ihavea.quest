---
layout: layouts/post.njk
title: Fixing DNS issues on the Arch cloud image on Digital Ocean
date: 2024-09-04
tags: ['post']
---

## The issue

When running an [Arch cloud image](https://wiki.archlinux.org/title/Arch_Linux_on_a_VPS#Official_Arch_Linux_cloud_image) on Digital Ocean, DNS lookups frequently fail or take an unreasonably long time to resolve.

Look at this insanely long query time:

```text
λ resolvectl query archlinux.org
archlinux.org: 95.217.163.246                  -- link: eth0
               2a01:4f9:c010:6b1f::1           -- link: eth0

-- Information acquired via protocol DNS in 13.3339s.
-- Data is authenticated: no; Data was acquired via local or encrypted transport: yes
-- Data from: network
```

And this query just fails:

```text
λ resolvectl query badsig.go.dnscheck.tools
badsig.go.dnscheck.tools: resolve call failed: DNSSEC validation failed: failed-auxiliary
```

System updates are also slow due to mirrors taking long to resolve, and docker images don't build correctly. I use run [linuxserver.io](https://www.linuxserver.io/)'s [SWAG](https://github.com/linuxserver/docker-swag) with the [imagemagick mod](https://github.com/linuxserver/docker-mods/tree/swag-imagemagick), and this mod in particular was failing to download and get added to the image.

```text
λ sudo docker compose -f docker-compose.yml up -d
[+] Running 1/1
 ✔ Container swag  Started                              0.7s

λ sudo docker logs -f swag
[mod-init] Running Docker Modification Logic
[mod-init] Adding linuxserver/mods:swag-imagemagick to container
[mod-init] Downloading linuxserver/mods:swag-imagemagick from lscr.io
[mod-init] Installing linuxserver/mods:swag-imagemagick
[mod-init] linuxserver/mods:swag-imagemagick applied to container
[migrations] started
[migrations] 01-nginx-site-confs-default: skipped
[migrations] done
───────────────────────────────────────

      ██╗     ███████╗██╗ ██████╗
      ██║     ██╔════╝██║██╔═══██╗
      ██║     ███████╗██║██║   ██║
      ██║     ╚════██║██║██║   ██║
      ███████╗███████║██║╚██████╔╝
      ╚══════╝╚══════╝╚═╝ ╚═════╝

   Brought to you by linuxserver.io
───────────────────────────────────────

To support the app dev(s) visit:
Certbot: https://supporters.eff.org/donate/support-work-on-certbot

To support LSIO projects visit:
https://www.linuxserver.io/donate/

───────────────────────────────────────
GID/UID
───────────────────────────────────────

User UID:    1000
User GID:    1000
───────────────────────────────────────
Linuxserver.io version: 2.11.0-ls322
Build-date: 2024-09-02T20:57:08+00:00
───────────────────────────────────────

using keys found in /config/keys
Variables set:
PUID=1000
PGID=1000
TZ=Etc/UTC
URL=<snip>
VALIDATION=http
CERTPROVIDER=
DNSPLUGIN=
EMAIL=
STAGING=false

Using Let's Encrypt as the cert provider
http validation is selected
Certificate exists; parameters unchanged; starting nginx
The cert does not expire within the next day. Letting the cron script handle the renewal attempts overnight (2:08am).
**** adding imagemagick to package install list ****
[pkg-install-init] **** Installing all mod packages ****
fetch http://dl-cdn.alpinelinux.org/alpine/v3.20/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.20/community/x86_64/APKINDEX.tar.gz
WARNING: fetching http://dl-cdn.alpinelinux.org/alpine/v3.20/main: temporary error (try again later)
WARNING: fetching http://dl-cdn.alpinelinux.org/alpine/v3.20/community: temporary error (try again later)
ERROR: unable to select packages:
  imagemagick (no such package):
    required by: world[imagemagick]
  php83-pecl-imagick (no such package):
    required by: world[php83-pecl-imagick]
[custom-init] No custom files found, skipping...
[ls.io-init] done.
Server ready
```

Welp! No imagemagick in the container means my clients won't have imagick on their Wordpress servers.

## Troubleshooting

When I first started to debug this, I asked on [#archlinux](ircs://irc.libera.chat:6697/archlinux) at [Libera](https://libera.chat/), thinking it was a bug in the cloud image itself. It isn't. I was told to disable DNSSEC, which technically solves the problem, but is not a viable solution as we're lowering security.

Arch uses systemd-resolved by default for network resolution. Running `resolvectl` shows us:

```text
λ resolvectl
Global
           Protocols: +LLMNR +mDNS +DNSOverTLS DNSSEC=yes/supported
    resolv.conf mode: stub
  Current DNS Server: 1.1.1.1#cloudflare-dns.com
         DNS Servers: 1.1.1.1#cloudflare-dns.com 67.207.67.3 67.207.67.2
Fallback DNS Servers: 1.1.1.1#cloudflare-dns.com 9.9.9.9#dns.quad9.net 8.8.8.8#dns.google
                      2606:4700:4700::1111#cloudflare-dns.com 2620:fe::9#dns.quad9.net 2001:4860:4860::8888#dns.google

Link 2 (eth0)
    Current Scopes: DNS LLMNR/IPv4 LLMNR/IPv6
         Protocols: +DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=yes/supported
Current DNS Server: 67.207.67.2
       DNS Servers: 67.207.67.2 67.207.67.3

Link 3 (eth1)
    Current Scopes: DNS LLMNR/IPv4 LLMNR/IPv6
         Protocols: +DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=yes/supported
Current DNS Server: 67.207.67.3
       DNS Servers: 67.207.67.2 67.207.67.3
```

It looks like Digital Ocean's own DNS servers are being added to the list of DNS servers.

The next step was to search the OS for any files containing those IP addresses to find out what config file it's in to learn what might be causing it.

```text
λ sudo rg -i "67\.207\.67\.2" /
/var/lib/cloud/instances/385249616/vendor-data.txt
31:printf "[Resolve]\nDNS=67.207.67.3 67.207.67.2\n" > /etc/systemd/resolved.conf.d/DigitalOcean.conf

/var/lib/cloud/instances/385249616/vendor-data.txt.i
32:printf "[Resolve]\nDNS=67.207.67.3 67.207.67.2\n" > /etc/systemd/resolved.conf.d/DigitalOcean.conf

/var/lib/cloud/instances/385249616/boothooks/resolver-fix
6:printf "[Resolve]\nDNS=67.207.67.3 67.207.67.2\n" > /etc/systemd/resolved.conf.d/DigitalOcean.conf

/var/log/cloud-init-output.log
20:ci-info: |   2   |  67.207.67.2  | 143.110.176.1 | 255.255.255.255 |    eth0   |  UGH  |
129:ci-info: |   2   |  67.207.67.2  | 143.110.176.1 | 255.255.255.255 |    eth0   |  UGH  |
167:ci-info: |   2   |  67.207.67.2  | 143.110.176.1 | 255.255.255.255 |    eth0   |  UGH  |
205:ci-info: |   2   |  67.207.67.2  | 143.110.176.1 | 255.255.255.255 |    eth0   |  UGH  |
243:ci-info: |   2   |  67.207.67.2  | 143.110.176.1 | 255.255.255.255 |    eth0   |  UGH  |
262:+ printf '[Resolve]\nDNS=67.207.67.3 67.207.67.2\n'

/run/systemd/netif/links/2
15:DNS=67.207.67.2 67.207.67.3

/run/systemd/netif/links/3
15:DNS=67.207.67.2 67.207.67.3

/run/systemd/netif/leases/2
11:DNS=67.207.67.2 67.207.67.3

/run/systemd/netif/leases/3
11:DNS=67.207.67.2 67.207.67.3

/run/systemd/netif/state
8:DNS=67.207.67.2 67.207.67.3

/run/systemd/resolve/resolv.conf
18:nameserver 67.207.67.2
21:nameserver 67.207.67.2
```

What in the world? What's cloud-init?

```text
λ pacman -Ss cloud-init
extra/cloud-init 24.2-1 [installed]
    Cloud instance initialization
```

Turns out [it's a package](https://wiki.archlinux.org/title/Cloud-init) that contains utilities for early initialization of cloud instances, and is needed in Arch Linux images that are built with the intention of being launched in cloud environments.

Okay, so there must be a way to have it not inject Digital Ocean's DNS IPs, right?

The [cloud-init docs say](https://docs.cloud-init.io/en/latest/reference/modules.html#resolv-conf) setting `manage_resolv_conf` must be set to true in order for a `resolv_conf` section to be applied.

Alright, let's check the cloud-init config file.

```text
λ cat /etc/cloud/cloud.cfg
# The top level settings are used as module
# and base configuration.

# A set of users which may be applied and/or used by various modules
# when a 'default' entry is found it will reference the 'default_user'
# from the distro configuration specified below
users:
  - default

# If this is set, 'root' will not be able to ssh in and they
# will get a message to login instead as the default $user
disable_root: true

# This will cause the set+update hostname module to not operate (if true)
preserve_hostname: false

# If you use datasource_list array, keep array items in a single line.
# If you use multi line array, ds-identify script won't read array items.
# Example datasource config
# datasource:
#   Ec2:
#     metadata_urls: [ 'blah.com' ]
#     timeout: 5 # (defaults to 50 seconds)
#     max_wait: 10 # (defaults to 120 seconds)

# The modules that run in the 'init' stage
cloud_init_modules:
  - seed_random
  - bootcmd
  - write_files
  - growpart
  - resizefs
  - disk_setup
  - mounts
  - set_hostname
  - update_hostname
  - update_etc_hosts
  - ca_certs
  - rsyslog
  - users_groups
  - ssh
  - set_passwords

# The modules that run in the 'config' stage
cloud_config_modules:
  - ssh_import_id
  - keyboard
  - locale
  - ntp
  - timezone
  - disable_ec2_metadata
  - runcmd

# The modules that run in the 'final' stage
cloud_final_modules:
  - package_update_upgrade_install
  - write_files_deferred
  - puppet
  - chef
  - ansible
  - mcollective
  - salt_minion
  - reset_rmc
  - scripts_vendor
  - scripts_per_once
  - scripts_per_boot
  - scripts_per_instance
  - scripts_user
  - ssh_authkey_fingerprints
  - keys_to_console
  - install_hotplug
  - phone_home
  - final_message
  - power_state_change

# System and/or distro specific settings
# (not accessible to handlers/transforms)
system_info:
  # This will affect which distro class gets used
  distro: arch
  # Default user name + that default users groups (if added/used)
  default_user:
    name: arch
    lock_passwd: True
    gecos: arch Cloud User
    groups: [wheel, users]
    sudo: ["ALL=(ALL) NOPASSWD:ALL"]
    shell: /bin/bash
  # Other config here will be given to the distro class and/or path classes
  paths:
    cloud_dir: /var/lib/cloud/
    templates_dir: /etc/cloud/templates/
  ssh_svcname: sshd
```

No `resolv_conf` section in here. And sure enough, adding `manage_resolv_conf: false` does nothing either.

We saw this file earlier `/var/lib/cloud/instances/385249616/boothooks/resolver-fix` in the search log earlier. Let's see what it does.

```text
λ sudo cat /var/lib/cloud/instances/385249616/boothooks/resolver-fix
#!/bin/sh -x
# DigitalOcean resolver fixup script
[ -f /etc/systemd/resolved.conf ] || exit 0
logger -t DigitalOcean 'writing resolvers  to /etc/systemd/resolved.conf.d/DigitalOcean.conf'
mkdir -p /etc/systemd/resolved.conf.d
printf "[Resolve]\nDNS=67.207.67.3 67.207.67.2\n" > /etc/systemd/resolved.conf.d/DigitalOcean.conf
systemctl try-reload-or-restart systemd-resolved
```

JFC. It adds the DNS IPs as part of the cloud-init process at boot.

Searching for this on DuckDuckGo led nowhere. So I \*shudder\* searched on Google, which surprisingly yielded a [Chinese blog post](https://blog.desmg.com/wp/1314.html) with what seemed like a solution. The author is impressed by the Digital Ocean Customer Support Staff's confusion and inability to solve two support tickets about this.

The blog post suggests creating a [systemd service file](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) to remove the offending config file before and whenever `systemd-resolved.service` is started, stopped, or reloaded.

## Solution

Let's create a file `/etc/systemd/system/remove-systemd-resolved-conf-d.service`.

```conf
[Unit]
Description=remove-systemd-resolved-conf-d.service

[Service]
Type=oneshot
ExecStartPre=rm -rf /etc/systemd/resolved.conf.d
ExecStart=rm -rf /etc/systemd/resolved.conf.d
ExecStop=rm -rf /etc/systemd/resolved.conf.d
ExecReload=rm -rf /etc/systemd/resolved.conf.d
```

Then make `systemd-resolved.service` want it.

```bash
λ systemctl add-wants systemd-resolved.service remove-systemd-resolved-conf-d.service
λ systemctl restart systemd-resolved.service
```

Now run `resolvectl` to check.

```text
λ resolvectl
Global
           Protocols: +LLMNR +mDNS +DNSOverTLS DNSSEC=yes/supported
    resolv.conf mode: stub
         DNS Servers: 1.1.1.1#cloudflare-dns.com
Fallback DNS Servers: 1.1.1.1#cloudflare-dns.com 9.9.9.9#dns.quad9.net 8.8.8.8#dns.google
                      2606:4700:4700::1111#cloudflare-dns.com 2620:fe::9#dns.quad9.net 2001:4860:4860::8888#dns.google

Link 2 (eth0)
    Current Scopes: DNS LLMNR/IPv4 LLMNR/IPv6
         Protocols: +DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=yes/supported
Current DNS Server: 67.207.67.2
       DNS Servers: 67.207.67.2 67.207.67.3

Link 3 (eth1)
    Current Scopes: DNS LLMNR/IPv4 LLMNR/IPv6
         Protocols: +DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=yes/supported
Current DNS Server: 67.207.67.2
       DNS Servers: 67.207.67.2 67.207.67.3
```

Okay good. The offending DNS server IPs are gone from the `Global` section, and it stays this way even after a reboot.

The two network interfaces are still using those IPs though, and DNS resolution isn't any better than before.

There are no other relevant files with these IPs in them so this time they must be being pulled dynamically.

Let's look in `/etc/systemd/network/` to see if these interfaces are defined there.

```text
λ eza -gal /etc/systemd/network
.rw-r--r-- 110 systemd-network systemd-network  4 Sep 12:52 10-cloud-init-eth0.network
.rw-r--r-- 111 systemd-network systemd-network  4 Sep 12:52 10-cloud-init-eth1.network
```

Yep!

Let's see what's inside them.

```text
λ cat /etc/systemd/network/10-cloud-init-eth0.network
[Link]
MTUBytes=1500

[Match]
MACAddress=c7:6a:4c:84:f1:d5
Name=eth0

[Network]
DHCP=ipv4

λ cat /etc/systemd/network/10-cloud-init-eth1.network
[Link]
MTUBytes=1500

[Match]
MACAddress=da:e9:9c:92:74:3d
Name=eth1

[Network]
DHCP=ipv4
```

They're using DHCP, so the DHCP server must be providing the DNS addresses.

This is an easy enough fix.

Just add `UseDNS=no` in both files.

They should look like this now:

```text
λ cat /etc/systemd/network/10-cloud-init-eth0.network
[Link]
MTUBytes=1500

[Match]
MACAddress=c7:6a:4c:84:f1:d5
Name=eth0

[Network]
DHCP=ipv4

[DHCPv4]
UseDNS=no

λ cat /etc/systemd/network/10-cloud-init-eth1.network
[Link]
MTUBytes=1500

[Match]
MACAddress=da:e9:9c:92:74:3d
Name=eth1

[Network]
DHCP=ipv4

[DHCPv4]
UseDNS=no
```

Reload your network, and your DNS resolution woes should be yesterday's news.

```bash
λ systemctl reload systemd-resolved.service
```

Let's check `resolvectl`.

```text
λ resolvectl
Global
           Protocols: +LLMNR +mDNS +DNSOverTLS DNSSEC=yes/supported
    resolv.conf mode: stub
  Current DNS Server: 1.1.1.1#cloudflare-dns.com
         DNS Servers: 1.1.1.1#cloudflare-dns.com
Fallback DNS Servers: 1.1.1.1#cloudflare-dns.com 9.9.9.9#dns.quad9.net 8.8.8.8#dns.google
                      2606:4700:4700::1111#cloudflare-dns.com 2620:fe::9#dns.quad9.net 2001:4860:4860::8888#dns.google

Link 2 (eth0)
    Current Scopes: LLMNR/IPv4 LLMNR/IPv6
         Protocols: -DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=yes/supported

Link 3 (eth1)
    Current Scopes: LLMNR/IPv4 LLMNR/IPv6
         Protocols: -DefaultRoute +LLMNR -mDNS +DNSOverTLS DNSSEC=yes/supported
```

Awesome!

The linuxserver mod downloads and builds sucessfully now, and resolving domains takes milliseconds.
