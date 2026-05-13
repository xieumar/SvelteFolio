<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	const vertexShaderSource = `
		attribute vec2 position;
		void main() {
			gl_Position = vec4(position, 0.0, 1.0);
		}
	`;

	const fragmentShaderSource = `
		precision highp float;
		uniform float time;
		uniform vec2 resolution;
		uniform vec2 mouse;

		void main() {
			vec2 uv = gl_FragCoord.xy / resolution.xy;
			uv.x *= resolution.x / resolution.y;

			vec2 m = mouse / resolution.xy;
			m.x *= resolution.x / resolution.y;

			// Grid settings
			float gridSize = 30.0;
			vec2 gridUv = fract(uv * gridSize) - 0.5;
			vec2 gridId = floor(uv * gridSize);

			// Pulsing dots
			float dist = length(gridUv);
			float mouseDist = distance(uv, m);
			
			float pulse = sin(time * 2.0 + gridId.x * 0.5 + gridId.y * 0.3) * 0.5 + 0.5;
			float radius = 0.05 * pulse;
			
			// Interaction
			radius += 0.15 * (1.0 - smoothstep(0.0, 0.5, mouseDist));

			float color = 1.0 - smoothstep(radius, radius + 0.02, dist);
			
			// Subtle grid lines
			float lines = (1.0 - smoothstep(0.0, 0.02, abs(gridUv.x))) * 0.1;
			lines += (1.0 - smoothstep(0.0, 0.02, abs(gridUv.y))) * 0.1;

			vec3 finalColor = vec3(0.0, 1.0, 0.6) * (color + lines); // Cyber Green
			finalColor *= (1.0 - mouseDist * 0.5); // Vignette
			
			gl_FragColor = vec4(finalColor * 0.3, 1.0); 
		}
	`;

	onMount(() => {
		const gl = canvas.getContext('webgl');
		if (!gl) return;

		function createShader(gl: WebGLRenderingContext, type: number, source: string) {
			const shader = gl.createShader(type);
			if (!shader) return null;
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			return shader;
		}

		const program = gl.createProgram();
		if (!program) return;
		
		const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		
		if (!vs || !fs) return;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		gl.useProgram(program);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

		const positionLoc = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		const timeLoc = gl.getUniformLocation(program, 'time');
		const resLoc = gl.getUniformLocation(program, 'resolution');
		const mouseLoc = gl.getUniformLocation(program, 'mouse');

		let mouseX = 0, mouseY = 0;
		window.addEventListener('mousemove', (e) => {
			mouseX = e.clientX;
			mouseY = window.innerHeight - e.clientY;
		});

		function render(timeValue: number) {
			if (!canvas) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			gl!.viewport(0, 0, canvas.width, canvas.height);

			gl!.uniform1f(timeLoc, timeValue * 0.001);
			gl!.uniform2f(resLoc, canvas.width, canvas.height);
			gl!.uniform2f(mouseLoc, mouseX, mouseY);

			gl!.drawArrays(gl!.TRIANGLES, 0, 6);
			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);
	});
</script>

<canvas bind:this={canvas} class="fixed inset-0 -z-10 pointer-events-none opacity-80 bg-obsidian"></canvas>
