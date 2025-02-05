defmodule ShaderLab.MixProject do
  use Mix.Project

  def project do
    [
      app: :shader_lab,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {ShaderLab.Application, [port: 4000]},
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:poison, "~> 6.0"},
      {:httpoison, "~> 1.8"},
      {:cors_plug, "~> 3.0"}
    ]
  end
end
