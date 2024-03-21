---
title: How to install Endeavour OS?
tags:
  - endeavour-os
---

> [!warning]
> This guide is very specific to my preferences! It's primary purpose is for my future reference.

> [!note]
> My machine uses an NVIDIA graphics card.

# Flash Image

Download the image from [Endeavour OS](https://endeavouros.com/).
Use [Rufus](https://rufus.ie/) to create a bootable USB drive.

# Configure OS install

Boot into USB drive using NVIDIA option in the boot manager.

After you boot into the USB drive, during the installer configuration, prefer offline install. Choose `btrfs` partition on full disk install. No swap, single partition for OS (and bootloader EFI partition ofcourse). Also choose `systemd-boot` for init.

Now after reboot, you should be in the installed OS.

# Refresh Arch Linux Keyring

```zsh
yay -Sy archlinux-keyring
```

And use Endeavour OS tools to rank mirrors, update system packages to latest (preferably at the end of the guide)

# Install Linux LTS kernel

By default, since Endeavour OS follows a rolling release cycle, it comes with the latest stable Linux Kernel (*i.e.* `linux` and `linux-headers` packages). Preferably keep both this and the LTE kernels. To install LTE Kernel,

```zsh
yay -Sy linux-lts linux-lts-headers
```

and reboot into LTS kernel, by choosing the option in bootmanager after reboot.

# Install NVIDIA Drivers

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

# Final touches...

- Move Plasma Taskbar to the left edge
- Install packages (some are from AUR)
    - Google Chrome: `google-chrome`
    - Visual Studio Code: `visual-studio-code-bin`
    - Neovim: `neovim`
- Setup Git: [[git-setup]]
