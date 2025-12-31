{
  pkgs, ...
}: {
  channel = "stable-24.05";

  packages = [ pkgs.nodejs_20 ];

  idx = {
    extensions = [ "dbaeumer.vscode-eslint" ];

    workspace = {
      onCreate = {
        backend-deps = "cd functions && npm install";
        frontend-deps = "cd frontend && npm install";
      };

      onStart = {
        dev-server = "cd frontend && npm run dev";
      };
    };
  };
}
