# ShaderLab

**A Rest API Service to Generate WebGL Shaders**

## How to install 
Make sure you have `elixir` and `mix` installed on your machine. 

1. Clone the repository
```bash
git clone https://github.com/imsk17/invideo-assignment.git
```

2. Change Directory
```bash
cd shader_lab
```

3. Install dependencies
```bash
mix deps.get
```

4. Start the server
```bash
mix run --no-halt
```

## How to use

1. Send a POST request to `http://localhost:$PORT/shaders/generate` with the following payload
```json
{
  "description": "A rotating cube with a gradient background",
}
```