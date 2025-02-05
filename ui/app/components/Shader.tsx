"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function TextToShader() {
  const [description, setDescription] = useState<string>("");
  const [shaderCode, setShaderCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shaderFetched, setShaderFetched] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const generateShader = async () => {
    if (!description.trim()) {
      setError("Please enter a shader description");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let response = await fetch('http://localhost:4000/shaders/generate', {
        body: JSON.stringify({description}),
        method: "POST"
      });
      let code = (await response.json()).code
      console.log(code)
      setShaderCode(code);
      if (canvasRef.current) {
        setupWebGL();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate shader"
      );
      console.error("Shader generation error:", err);
    } finally {
      setIsLoading(false);
      setShaderFetched(true);
    }
  };

  const setupWebGL = useCallback(() => {
    if (!canvasRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const gl = canvasRef.current.getContext("webgl2");
    if (!gl) {
      setError("WebGL2 not supported in your browser");
      return;
    }

    const vertexShaderSource = `#version 300 es
    in vec4 position;
    void main() {
      gl_Position = position;
    }`;

    try {
      const vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, shaderCode);

      const program = gl.createProgram();
      if (!program) {
        throw new Error("Failed to create program");
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Program link error: " + gl.getProgramInfoLog(program));
      }

      const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const positionAttributeLocation = gl.getAttribLocation(
        program,
        "position"
      );
      const timeLocation = gl.getUniformLocation(program, "time");
      const resolutionLocation = gl.getUniformLocation(program, "resolution");

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      const render = () => {
        const time = (Date.now() - startTimeRef.current) / 1000;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(program);
        gl.uniform1f(timeLocation, time);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationFrameRef.current = requestAnimationFrame(render);
      };

      render();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown shader error";
      setError(errorMessage);
    }
  }, [shaderCode, setError]);

  const initShader = (
    gl: WebGL2RenderingContext,
    type: number,
    source: string
  ) => {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      setError("Shader compilation error: " + info);
    }

    return shader;
  };

  useEffect(() => {
    if (!shaderFetched) return;
    if (canvasRef.current) {
      const pixelRatio = window.devicePixelRatio || 1;
      canvasRef.current.width = 800 * pixelRatio;
      canvasRef.current.height = 600 * pixelRatio;

      setupWebGL();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shaderCode, shaderFetched, setupWebGL]);

  return (
    <div className="space-y-4">
      <textarea 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the shader (e.g., A rotating cube with a gradient background)"
        className="w-full p-2 border rounded h-24"
      />
      <button 
        onClick={generateShader}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Generate Shader
      </button>

      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="border rounded"
      />

      {error && (
        <div className="text-red-500">
          Error: {error}
        </div>
      )}

      {shaderCode && (
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {shaderCode}
        </pre>
      )}
    </div>
  )
}
