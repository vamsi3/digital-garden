##### Installation

###### Install Determinate Nix

Source: https://determinate.systems/nix-installer/
```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install --determinate
```

###### Enable Flakes and new command line interface

Create `~/.config/nix/nix.conf` and enter
```
experimental-features = nix-command flakes
```

##### Debugging

You can print any value into shell using something like

```nix
# This line is to debug `config`
x = lib.debug.traceValFn builtins.attrNames config;
```

# <<<<< ARCHIVED>>>>>
## Global `flake.nix`

### macOS

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = { self, nixpkgs }: {
    packages."aarch64-darwin".default = let
      pkgs = import nixpkgs {
        system = "aarch64-darwin";
        config = {
          allowUnfree = true;
          allowUnfreePredicate = _: true;
        };
      };
    in pkgs.buildEnv {
      name = "home-packages";
      paths = with pkgs; [
        alacritty
        # android-studio
        git
        # github-desktop
        localsend
        mos
        obsidian
        raycast
        # ungoogled-chromium
        utm
        zed-editor
      ];
    };
  };
}
```
## Steps

1. Create file `~/zen/nix/global/flake.nix`
2. `nix profile install ~/zen/nix/global/`
3. `nix profile list` should show the newly installed profile
4. To upgrade, `nix profile upgrade global`
5. Open Raycast from `~/.nix-profile/Applications/Raycast.app` and setup
6. Once in a while, run `nix-store --gc` to run garbage collector
