{ pkgs }: {
  deps = [
    pkgs.python39
    pkgs.python39Packages.pip
    pkgs.python39Packages.virtualenv
    pkgs.nodejs-18_x
    pkgs.yarn
    pkgs.postgresql_13
    pkgs.git
    pkgs.curl
    pkgs.wget
  ];
} 