---
title: How to install Endeavour OS?
tags:
  - endeavour-os
---

> [!warning]
> This guide is very specific to my preferences! It's primary purpose is for my future reference.

> [!note]
> My machine uses an NVIDIA graphics card.

# Before that, backup!

This section is a checklist before you uninstall the existing arch linux system. This list is meant to be exhaustive, not all are necessarily updated manually.

- Backup `zsh` and related config files - `~/.zshrc`, `~/.zsh_plugins.txt`, `~/.config/starship.toml`
- Backup `alacritty` config files, `~/.alacritty.toml` and imports mentioned in that file, maybe like `~/.config/alacritty/nord.toml`.

# Guide

## Flash Image

Download the image from [Endeavour OS](https://endeavouros.com/).
Use [Rufus](https://rufus.ie/) to create a bootable USB drive.

## Configure OS install

Boot into USB drive using NVIDIA option in the boot manager.

After you boot into the USB drive, during the installer configuration, prefer offline install. Choose `btrfs` partition on full disk install. No swap, single partition for OS (and bootloader EFI partition ofcourse). Also choose `systemd-boot` for init.

Now after reboot, you should be in the installed OS.

## Refresh Arch Linux Keyring

```zsh
yay -Sy archlinux-keyring
```

And use Endeavour OS tools to rank mirrors, update system packages to latest (preferably at the end of the guide)

## Install Linux LTS kernel

By default, since Endeavour OS follows a rolling release cycle, it comes with the latest stable Linux Kernel (*i.e.* `linux` and `linux-headers` packages). Preferably keep both this and the LTE kernels. To install LTE Kernel,

```zsh
yay -Sy linux-lts linux-lts-headers
```

and reboot into LTS kernel, by choosing the option in bootmanager after reboot.

## Install NVIDIA Drivers

Enable Early KMS loading of NVIDIA modules using `dracut`. Just add a new file, say `nvidia.conf` with content as,

```
force_drivers+=" nvidia nvidia_modeset nvidia_uvm nvidia_drm "
```

> [!info]
> Endeavour OS uses dracut - more details on this can be found at https://discovery.endeavouros.com/installation/dracut/2022/12/

Use `nvidia-inst` package. It'll take care of most things, including rebuilding the `initramfs`  file (can be done manually too *via.* `sudo reinstall-kernels`).


After reboot, verify the the `nvidia_drm.modeset=1` kernel modesetting is enabled using the command,

```zsh
cat /sys/module/nvidia_drm/parameters/modeset
```

which should now return `Y`, and not `N` anymore.

> [!info]
> More info at https://wiki.archlinux.org/title/NVIDIA/

Also, you can check `nvidia-smi` to see if `Xorg` is using the NVIDIA card for display graphics. (assuming you login to X11 and not Wayland).

## Final touches...

### Plasma

- In Settings -> Window Management -> Virtual Desktops, add more desktops.
- In Settings -> Keyboard -> Shortcuts
    - KWin -> Toggle Grid View -> Add `Meta+Backtick`
    - KWin -> Window to Next Desktop -> Add `Meta+Tab`
    - Add new application -> Alacritty -> for new terminal -> set `Alt+Tab`
- Move Plasma Taskbar to the left edge
- Right click on Plasma Taskbar -> 'Configure Icons-Only taskbar' -> 'Behavior' -> 'Show only tasks' -> disable 'From current desktop'
- In Settings -> Window Management -> Task Switcher
    - Filter windows by -> Virtual Desktops -> must be set to 'All other desktops'

### IntelliJ IDEA

- In settings
    - Appearance -> Use custom font -> `Noto Sans Medium`, Size 11
    - Apperance -> UI options -> 'Use smaller indents in trees'
    - New UI -> Enable 'Compact Mode', 'Show main menu in a separate toolbar'
    - Editor -> General -> Mouse Control -> Enable 'Change font size with Ctrl+Mouse Wheel in' -> All editors
    - Editor -> Font -> `NotoSansM NFM`, Size: 13, Line height: 1.1
- In plugins,
    - One Dark Theme (use 'One Dark Vivid')
    - Rainbow Brackets
    - CSV Editor
    - Atom Material Icons
    - [Developer Tools](https://plugins.jetbrains.com/plugin/21904-developer-tools)
    - [Gerry Themes](https://plugins.jetbrains.com/plugin/18922-gerry-themes)


### Others

- Setup Git: [[git-setup]]
- Install packages (some are from AUR)
    - Google Chrome: `google-chrome`
    - Visual Studio Code: `visual-studio-code-bin`
    - Neovim: `neovim`
    - IntelliJ IDEA: `intellij-idea-community-edition`
    - [exa](https://github.com/ogham/exa): better `ls` written in rust
    - [bat](https://github.com/sharkdp/bat): better `cat` written in rust
    - [dust](https://github.com/bootandy/dust): better `du` written in rust
    - [ripgrep](https://github.com/BurntSushi/ripgrep): better `grep` written in rust
    - [fd](https://github.com/sharkdp/fd): better `find` written in rust
    - [procs](https://github.com/dalance/procs): better `procs` written in rust
    - [tealdeer](https://github.com/dbrgn/tealdeer): better `tldr` written in rust
    - [bottom](https://github.com/ClementTsang/bottom): inspired by `gtop`, `gotop`, and `htop` and written in rust
    - [zoxide](https://github.com/ajeetdsouza/zoxide): better `cd` written in rust
    - [broot](https://github.com/Canop/broot): explore large directories, written in rust
    - [skim](https://github.com/lotabout/skim): Skim is a command-line fuzzy finder. It can be used as a general filter (like `grep`) or as an interactive interface for invoking commands.
    - [tokei](https://github.com/XAMPPRocky/tokei): Tokei is a program that displays statistics about your code. Tokei will show the number of files, total lines within those files and code, comments, and blanks grouped by language.
    - [alacritty](https://github.com/alacritty/alacritty): Terminal emulator, replaces Konsole.
    - [lazygit](https://github.com/jesseduffield/lazygit)
