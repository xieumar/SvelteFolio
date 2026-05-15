<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';

	// Game State
	let gameState: 'idle' | 'playing' | 'gameover' = $state('idle');
	let score = $state(0);
	let highScore = $state(0);
	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationFrameId: number;

	// Game Constants
	const PLAYER_SIZE = 12;
	const NODE_SIZE = 8;
	const GLITCH_SIZE = 14;
	const SPAWN_RATE = 0.012; // Reduced from 0.02
	const GLITCH_SPAWN_RATE = 0.003; // Reduced from 0.005

	// Game Objects
	interface GameObject {
		x: number;
		y: number;
		vx: number;
		vy: number;
		type: 'node' | 'glitch';
		life: number;
	}

	let player = { x: 0, y: 0, targetX: 0, targetY: 0 };
	let objects: GameObject[] = [];
	let particles: { x: number, y: number, vx: number, vy: number, life: number, color: string }[] = [];

	function initGame() {
		score = 0;
		objects = [];
		particles = [];
		gameState = 'playing';
		
		// Reset player position to center
		if (canvas) {
			player.x = canvas.width / 2;
			player.y = canvas.height / 2;
			player.targetX = player.x;
			player.targetY = player.y;
		}
	}

	function spawnObject(type: 'node' | 'glitch') {
		const side = Math.floor(Math.random() * 4);
		let x, y, vx, vy;
		
		if (side === 0) { // Top
			x = Math.random() * canvas.width;
			y = -20;
			vx = (Math.random() - 0.5) * 1.5;
			vy = Math.random() * 1.5 + 0.5;
		} else if (side === 1) { // Right
			x = canvas.width + 20;
			y = Math.random() * canvas.height;
			vx = -(Math.random() * 1.5 + 0.5);
			vy = (Math.random() - 0.5) * 1.5;
		} else if (side === 2) { // Bottom
			x = Math.random() * canvas.width;
			y = canvas.height + 20;
			vx = (Math.random() - 0.5) * 1.5;
			vy = -(Math.random() * 1.5 + 0.5);
		} else { // Left
			x = -20;
			y = Math.random() * canvas.height;
			vx = Math.random() * 1.5 + 0.5;
			vy = (Math.random() - 0.5) * 1.5;
		}

		objects.push({ x, y, vx, vy, type, life: 1 });
	}

	function createParticles(x: number, y: number, color: string) {
		for (let i = 0; i < 8; i++) {
			particles.push({
				x,
				y,
				vx: (Math.random() - 0.5) * 6,
				vy: (Math.random() - 0.5) * 6,
				life: 1,
				color
			});
		}
	}

	function update() {
		if (gameState !== 'playing') return;

		// Move player towards target with smoothing
		player.x += (player.targetX - player.x) * 0.12; // Slightly slower following (was 0.15)
		player.y += (player.targetY - player.y) * 0.12;

		// Spawn nodes
		if (Math.random() < SPAWN_RATE + (score * 0.0001)) {
			spawnObject('node');
		}

		// Spawn glitches
		if (Math.random() < GLITCH_SPAWN_RATE + (score * 0.00005)) {
			spawnObject('glitch');
		}

		// Update objects
		for (let i = objects.length - 1; i >= 0; i--) {
			const obj = objects[i];
			obj.x += obj.vx;
			obj.y += obj.vy;

			// Collision detection
			const dx = obj.x - player.x;
			const dy = obj.y - player.y;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist < (obj.type === 'node' ? PLAYER_SIZE + NODE_SIZE : PLAYER_SIZE + GLITCH_SIZE)) {
				if (obj.type === 'node') {
					score += 10;
					createParticles(obj.x, obj.y, '#00ff9d');
					objects.splice(i, 1);
				} else {
					gameOver();
				}
				continue;
			}

			// Remove out of bounds
			if (obj.x < -50 || obj.x > canvas.width + 50 || obj.y < -50 || obj.y > canvas.height + 50) {
				objects.splice(i, 1);
			}
		}

		// Update particles
		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			p.x += p.vx;
			p.y += p.vy;
			p.life -= 0.02;
			if (p.life <= 0) particles.splice(i, 1);
		}

		draw();
		animationFrameId = requestAnimationFrame(update);
	}

	function draw() {
		if (!ctx || !canvas) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw Grid
		ctx.strokeStyle = 'rgba(0, 255, 157, 0.05)';
		ctx.lineWidth = 1;
		const gridSize = 40;
		for (let x = 0; x < canvas.width; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}
		for (let y = 0; y < canvas.height; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}

		// Draw Particles
		particles.forEach(p => {
			ctx!.globalAlpha = p.life;
			ctx!.fillStyle = p.color;
			ctx!.beginPath();
			ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2);
			ctx!.fill();
		});
		ctx.globalAlpha = 1;

		// Draw Objects
		objects.forEach(obj => {
			if (obj.type === 'node') {
				ctx!.shadowBlur = 15;
				ctx!.shadowColor = '#00ff9d';
				ctx!.fillStyle = '#00ff9d';
				ctx!.beginPath();
				ctx!.arc(obj.x, obj.y, NODE_SIZE, 0, Math.PI * 2);
				ctx!.fill();
			} else {
				ctx!.shadowBlur = 20;
				ctx!.shadowColor = '#ff4d4d';
				ctx!.fillStyle = '#ff4d4d';
				ctx!.save();
				ctx!.translate(obj.x, obj.y);
				ctx!.rotate(Date.now() * 0.005);
				ctx!.fillRect(-GLITCH_SIZE/2, -GLITCH_SIZE/2, GLITCH_SIZE, GLITCH_SIZE);
				ctx!.restore();
			}
		});

		// Draw Player
		ctx.shadowBlur = 25;
		ctx.shadowColor = '#00ff9d';
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(player.x, player.y, PLAYER_SIZE, 0, Math.PI * 2);
		ctx.fill();
		
		// Reset shadow
		ctx.shadowBlur = 0;
	}

	function gameOver() {
		gameState = 'gameover';
		if (score > highScore) highScore = score;
		cancelAnimationFrame(animationFrameId);
		
		// Game over animation
		gsap.from('.game-over-panel', {
			scale: 0.8,
			opacity: 0,
			duration: 0.5,
			ease: 'back.out(1.7)'
		});
	}

	function handleMouseMove(e: MouseEvent | TouchEvent) {
		if (gameState !== 'playing') return;
		const rect = canvas.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		
		player.targetX = clientX - rect.left;
		player.targetY = clientY - rect.top;
	}

	function resize() {
		if (!container || !canvas) return;
		canvas.width = container.clientWidth;
		canvas.height = 500; // Fixed height for section
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		resize();
		window.addEventListener('resize', resize);
		
		// Initial draw
		draw();

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationFrameId);
		};
	});

	$effect(() => {
		if (gameState === 'playing') {
			update();
		}
	});
</script>

<section id="mini-game" class="relative py-24 px-4 overflow-hidden bg-obsidian">
	<div class="max-w-6xl mx-auto">
		<!-- Section Header -->
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
				System <span class="text-cyber">Diagnostics</span>
			</h2>
			<p class="text-slate max-w-xl mx-auto">
				Take a break and test your reflexes. Collect data nodes, avoid system glitches.
			</p>
		</div>

		<!-- Game Container -->
		<div 
			bind:this={container}
			class="relative w-full h-[500px] glass rounded-3xl overflow-hidden border border-cyber/20 shadow-[0_0_50px_rgba(0,255,157,0.05)]"
		>
			<canvas 
				bind:this={canvas}
				onmousemove={handleMouseMove}
				ontouchmove={handleMouseMove}
				class="w-full h-full cursor-none"
			></canvas>

			<!-- Score HUD -->
			{#if gameState === 'playing'}
				<div class="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none">
					<span class="text-[10px] uppercase tracking-widest text-cyber/60 font-mono">Current Score</span>
					<span class="text-3xl font-mono font-bold text-white leading-none">{score}</span>
				</div>
				<div class="absolute top-6 right-6 flex flex-col items-end gap-1 pointer-events-none">
					<span class="text-[10px] uppercase tracking-widest text-slate font-mono">High Score</span>
					<span class="text-xl font-mono font-bold text-slate/80 leading-none">{highScore}</span>
				</div>
			{/if}

			<!-- Idle Overlay -->
			{#if gameState === 'idle'}
				<div class="absolute inset-0 flex items-center justify-center bg-obsidian/40 backdrop-blur-sm z-20">
					<div class="text-center p-8 glass rounded-2xl border border-cyber/30 max-w-sm">
						<div class="w-16 h-16 bg-cyber/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cyber">
							<Icon icon="lucide:cpu" class="w-8 h-8" />
						</div>
						<h3 class="text-2xl font-bold mb-2">Initialize Cyber Sprint</h3>
						<p class="text-slate text-sm mb-8">
							Control the neural link to gather data packets. Watch out for corrupted sectors.
						</p>
						<button 
							onclick={initGame}
							class="w-full py-4 bg-cyber text-obsidian font-bold uppercase tracking-widest text-sm rounded-xl hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2"
						>
							<Icon icon="lucide:play" class="w-5 h-5" /> Start Link
						</button>
					</div>
				</div>
			{/if}

			<!-- Game Over Overlay -->
			{#if gameState === 'gameover'}
				<div class="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-md z-20">
					<div class="game-over-panel text-center p-10 glass rounded-3xl border border-red-500/30 max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.2)]">
						<div class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
							<Icon icon="lucide:alert-triangle" class="w-10 h-10" />
						</div>
						<h3 class="text-3xl font-bold mb-2 text-white">Link Severed</h3>
						<p class="text-slate text-sm mb-6">Critical system failure detected.</p>
						
						<div class="flex flex-col gap-4 mb-8">
							<div class="flex justify-between items-center py-3 border-y border-white/5 font-mono">
								<span class="text-slate text-xs uppercase">Nodes Collected</span>
								<span class="text-cyber font-bold">{score}</span>
							</div>
							<div class="flex justify-between items-center py-1 font-mono">
								<span class="text-slate text-xs uppercase">Peak Performance</span>
								<span class="text-white font-bold">{highScore}</span>
							</div>
						</div>

						<button 
							onclick={initGame}
							class="w-full py-4 bg-white text-obsidian font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-cyber hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
						>
							<Icon icon="lucide:refresh-cw" class="w-5 h-5" /> Reboot Link
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Instructions Footer -->
		<div class="mt-8 flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-widest text-slate">
			<div class="flex items-center gap-2">
				<span class="w-2 h-2 rounded-full bg-cyber shadow-[0_0_8px_#00ff9d]"></span>
				Data Nodes (+10)
			</div>
			<div class="flex items-center gap-2">
				<span class="w-2 h-2 rounded-sm bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
				System Glitches (Restart)
			</div>
			<div class="flex items-center gap-2">
				<Icon icon="lucide:mouse-pointer-2" class="w-4 h-4" />
				Follow Cursor
			</div>
		</div>
	</div>
</section>

<style>
	canvas {
		display: block;
		touch-action: none;
	}
	
	.glass {
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(10px);
	}
</style>
