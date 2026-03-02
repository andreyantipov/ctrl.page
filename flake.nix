{
  description = "ctrl.page dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        tsgo = pkgs.buildGo126Module {
          pname = "tsgo";
          version = "unstable-2026-03-01";

          src = pkgs.fetchFromGitHub {
            owner = "microsoft";
            repo = "typescript-go";
            rev = "0a7d128ada55f48fdcf84296473d8b2f469605ff";
            hash = "sha256-WrRpZeQEkYvOw31DKdvX6iksNP/dsO2Ol5vwUw5IA64=";
          };

          vendorHash = "sha256-dUO6rCw8BrIJ+igFrntTIro4k1PH69G2J1IWPKsGzfM=";

          subPackages = [ "cmd/tsgo" ];
        };

        # yzx: thin wrapper that bootstraps yazelix on first run
        yzx = pkgs.writeShellScriptBin "yzx" ''
          YAZELIX_DIR="$HOME/.config/yazelix"
          if [ ! -d "$YAZELIX_DIR" ]; then
            echo "Cloning yazelix to $YAZELIX_DIR..."
            ${pkgs.git}/bin/git clone https://github.com/luccahuguet/yazelix "$YAZELIX_DIR"
            cp "$YAZELIX_DIR/yazelix_default.toml" "$YAZELIX_DIR/yazelix.toml"
          fi
          if ! command -v devenv &>/dev/null; then
            echo "devenv required — install once with:"
            echo "  nix profile install github:cachix/devenv/latest"
            exit 1
          fi
          cd "$YAZELIX_DIR" || exit 1
          exec devenv --impure shell -- ${pkgs.nushell}/bin/nu -c "use nushell/scripts/core/yazelix.nu *; yzx $*"
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.bun
            tsgo
            yzx
          ];
        };
      }
    );
}
