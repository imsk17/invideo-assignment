defmodule ShaderLab.ShaderGenerator do
  @openai_sk System.get_env("OPENAI_SK") || ""

  @spec experiment(String.t()) :: String.t()
  def experiment(description) do
    body = %{
      "model" => "gpt-4o-mini",
      "messages" => [
        %{"role" => "developer", "content" => "generate a simple shader program in glsl webgl2 using the description that user has provided with a singular main function. return only code. no comments, nothing"},
        %{
          "role" => "user",
          "content" => description
        }
      ]
    }

    headers = [
      {"Content-Type", "application/json"},
      {"Authorization", "Bearer " <> @openai_sk}
    ]

    url =
      "https://api.openai.com/v1/chat/completions"

    options = [
      recv_timeout: 300_000
    ]

    case HTTPoison.post(url, Poison.encode!(body), headers, options) do
      {:ok,
       %HTTPoison.Response{
         status_code: 200,
         body: response_body
       }} ->
        shader_text =
          response_body
          |> Poison.decode!()
          |> get_in(["choices", Access.at(0), "message", "content"])

        shader_text || "// Failed to generate shader"

      {:error, err} ->
        IO.puts("Request failed due to:" <> err.reason)
        "// Failed to generate shader"
    end
  end
end
