<script lang="ts">
	import { onMount } from 'svelte';

	import { theme } from '$lib/theme.svelte';

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
		uniform float isLightMode;

		void main() {
			vec2 uv = gl_FragCoord.xy / resolution.xy;
			uv.x *= resolution.x / resolution.y;

			vec2 m = mouse / resolution.xy;
			m.x *= resolution.x / resolution.y;

			// Grid settings
			float gridSize = 40.0;
			vec2 gridUv = fract(uv * gridSize) - 0.5;
			vec2 gridId = floor(uv * gridSize);

			// Pulsing dots
			float dist = length(gridUv);
			float mouseDist = distance(uv, m);
			
			float pulse = sin(time * 1.5 + gridId.x * 0.4 + gridId.y * 0.2) * 0.5 + 0.5;
			float radius = 0.04 * pulse;
			
			// Interaction
			radius += 0.12 * (1.0 - smoothstep(0.0, 0.4, mouseDist));

			float colorStrength = 1.0 - smoothstep(radius, radius + 0.02, dist);
			
			// Subtle grid lines
			float lines = (1.0 - smoothstep(0.0, 0.015, abs(gridUv.x))) * 0.05;
			lines += (1.0 - smoothstep(0.0, 0.015, abs(gridUv.y))) * 0.05;

			// Theme Colors
			vec3 cyberGreen = vec3(0.0, 1.0, 0.6);
			vec3 darkBg = vec3(0.04, 0.04, 0.04);
			vec3 lightBg = vec3(0.97, 0.98, 1.0);
			
			vec3 bgColor = isLightMode > 0.5 ? lightBg : darkBg;
			vec3 dotColor = isLightMode > 0.5 ? vec3(0.0, 0.0, 0.0) : cyberGreen; // Black dots in light mode
			
			vec3 finalColor = mix(bgColor, dotColor, (colorStrength + lines) * (isLightMode > 0.5 ? 0.8 : 0.4));
			
			// Interaction Highlight
			if (isLightMode < 0.5) {
				finalColor += cyberGreen * (1.0 - smoothstep(0.0, 0.6, mouseDist)) * 0.15;
			}

			gl_FragColor = vec4(finalColor, 1.0); 
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
		const lightLoc = gl.getUniformLocation(program, 'isLightMode');

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
			gl!.uniform1f(lightLoc, theme.current === 'light' ? 1.0 : 0.0);

			gl!.drawArrays(gl!.TRIANGLES, 0, 6);
			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);
	});
</script>

<canvas bind:this={canvas} class="fixed inset-0 -z-10 pointer-events-none"></canvas>
