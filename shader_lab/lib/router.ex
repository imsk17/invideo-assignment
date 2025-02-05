defmodule ShaderLab.Router do
  use Plug.Router

  plug(CORSPlug, origin: "*")
  plug(Plug.Logger)

  plug(:match)
  plug(:dispatch)

  post "/shaders/generate" do
    {:ok, body, _conn} = Plug.Conn.read_body(conn)
    %{"description" => description} = Poison.decode!(body)
    shader_code = description |> ShaderLab.ShaderGenerator.experiment
    conn
    |> send_resp(200, Poison.encode!(%{code: shader_code}))
  end

  match _ do
    send_resp(conn, 404, "404 Not Found")
  end
end
