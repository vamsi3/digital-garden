---
title: RustDesk Setup
tags:
  - rustdesk
---

> [!info]
> I use [Endeavour OS](https://endeavouros.com/) which is based on Arch Linux.
> Desktop Environment is KDE Plasma.
> Firewall application is `firewalld` (with `firewall-config` as GUI)

[RustDesk](https://rustdesk.com/) is a remote desktop platform. It’s open-source, self-hostable, and seems to be fairly performant.

This guide will setup a self-hosted RustDesk server.

# Host Setup

```zsh
yay -S rustdesk
yay -S rustdesk-server-bin
sudo systemctl enable rustdesk-server-hbbr rustdesk-server-hbbs --now
```

## RustDesk App

In `Settings > Network`, set the value for `ID server` as the IP address of the current machine which is host.

In `Settings > Security > Password`, choose to use only permanent password and set it.

## Firewall

In `firewall-config` app, go to the `Ports` tab, and open the following,

Port | Protocol
-- | --
21115-21119 | tcp
8000 | tcp
21116 | udp

# Client Setup

Install RustDesk app,

- In Arch Linux, run `yay -S rustdesk`
- In Windows, install the `.exe` file.

Open RustDesk app, and in `Settings > Network`, set the value for `ID server` as the IP address of the host machine.

# That's it!

Now you should be able to connect to the host from client using host's ID and password set in the host.
