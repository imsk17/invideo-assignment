defmodule ShaderLab.Application do
  use Application

  def start(_type, _args) do
    port = System.get_env("PORT", "4000")

    children = [
      {
        Plug.Cowboy,
        scheme: :http,
        plug: ShaderLab.Router,
        options: [port: String.to_integer(port), protocol_options: [request_timeout: 10000]]
      }
    ]

    IO.puts("Listening on http://localhost:#{port}")

    opts = [strategy: :one_for_one, name: ShaderLab.Supervisor]

    children
    |> Supervisor.start_link(opts)
  end
end
