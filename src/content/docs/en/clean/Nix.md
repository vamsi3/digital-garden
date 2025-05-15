---
title: Nix
---

##### Installation

Use Determiniate Nix installer. Source: https://determinate.systems/nix-installer/

```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
```

Respond 'No' when prompted if you want to install 'Determinate' flavor of Nix.

##### Debugging

You can print any value into shell using something like

```nix
# This line is to debug `config`
x = lib.debug.traceValFn builtins.attrNames config;
```

##### Garbage Collection

Once in a while, run [`nix-collect-garbage --delete-old`](https://nix.dev/manual/nix/2.24/command-ref/nix-collect-garbage#description) to run garbage collector.

Maybe add in a `sudo` if there are `chmod` permission issues to delete unfree apps. I still don't understand why this happens sometimes, and if it is the right way, but you can't know everything ¯\\\_(ツ)\_/¯, and if it works it works (for now).

