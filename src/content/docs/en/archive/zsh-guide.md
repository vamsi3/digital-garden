---
title: Guide to setup `zsh` shell
---

Install `zsh`

```sh
yay -S zsh
```

Then run `zsh` command in shell to trigger `zsh-newuser-install` first time. Configure `zsh`. 

Install antidote

```sh
yay -S zsh-antidote
```

Add `~/.zsh_plugins.txt`


## Starship

Install

```sh
yay -S starship
```

Adding the following at end of ~.zshrc

```sh
eval "$(starship init zsh)"
```

Configure starship using nerd font preset

> https://starship.rs/presets/nerd-font

```sh
starship preset nerd-font-symbols -o ~/.config/starship.toml
```

We need a nerd font for this, so use `Noto nerd font`,

```sh
yay -S ttf-noto-nerd
```

Now to use this font, in Plasma system settings, go to Font settings and set fixed width font as `NotoSansM Nerd Font Mono` with font style as `Regular` (or as per preference)

## Konsole configuration

In Konsole, create a new profile named `vamsi` and set it as default. In edit profile popup, set `Command` to `/bin/zsh` to use `zsh` shell.

Also in appearance section, set the Konsole theme using `Get New...` and search for `Nordic Konsole` and apply that theme.

