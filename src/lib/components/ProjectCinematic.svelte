<script lang="ts">
	import { onMount } from 'svelte';
	import { projects, type Project } from '$lib/data/projects';
	import Icon from '@iconify/svelte';
	import { theme } from '$lib/theme.svelte';

	import ProjectModal from '$lib/components/ProjectModal.svelte';

	let sectionRef: HTMLElement;
	let currentIndex = $state(0);
	let isModalOpen = $state(false);

	// Interactive "Velocity Orbs"
	let orbs = $state(Array.from({ length: 20 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: 20 + Math.random() * 30,
		color: ['#00ff9d', '#00e5ff', '#9d00ff', '#ff0066'][Math.floor(Math.random() * 4)],
		vx: (Math.random() - 0.5) * 0.1,
		vy: (Math.random() - 0.5) * 0.1,
	})));

	function next() {
		currentIndex = (currentIndex + 1) % projects.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + projects.length) % projects.length;
	}

	function handleInteraction(e: MouseEvent) {
		const rect = sectionRef.getBoundingClientRect();
		const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
		const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

		orbs.forEach(orb => {
			const dx = orb.x - mouseX;
			const dy = orb.y - mouseY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 20) {
				const force = (20 - dist) / 20;
				orb.vx += (dx / dist) * force * 1.2;
				orb.vy += (dy / dist) * force * 1.2;
			}
		});
	}

	onMount(() => {
		let frame: number;
		const loop = () => {
			orbs.forEach(orb => {
				orb.x += orb.vx;
				orb.y += orb.vy;
				orb.vx *= 0.98;
				orb.vy *= 0.98;
				if (orb.x < 0 || orb.x > 100) orb.vx *= -1;
				if (orb.y < 0 || orb.y > 100) orb.vy *= -1;
			});
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	});

	let currentProject = $derived(projects[currentIndex]);
</script>

<section 
	bind:this={sectionRef} 
	id="projects"
	onmousemove={handleInteraction}
	onclick={handleInteraction}
	class="relative min-h-screen py-24 bg-theme overflow-hidden flex flex-col items-center justify-center cursor-crosshair"
>
	<!-- Interactive Velocity Orbs (Foreground) -->
	<div class="absolute inset-0 pointer-events-none z-20">
		{#each orbs as orb (orb.id)}
			<div 
				class="absolute rounded-full blur-[5px] opacity-40 shadow-[0_0_20px_rgba(0,255,157,0.4)]"
				style="
					left: {orb.x}%; 
					top: {orb.y}%; 
					width: {orb.size}px; 
					height: {orb.size}px; 
					background-color: {orb.color};
					transform: translate(-50%, -50%);
				"
			></div>
		{/each}
	</div>

	<div class="max-w-6xl w-full px-6 relative z-10 flex flex-col items-center text-center">
		
		<!-- Floating Case Study Label -->
		<div class="mb-16 flex items-center gap-4 opacity-40">
			<div class="w-8 h-[1px] bg-cyber"></div>
			<span class="text-[10px] font-mono tracking-[0.6em] text-[var(--text-secondary)] uppercase">
				Case_Study 0{currentIndex + 1}
			</span>
			<div class="w-8 h-[1px] bg-cyber"></div>
		</div>

		<!-- Main Project Content -->
		<div 
			class="relative group cursor-pointer" 
			onclick={() => isModalOpen = true}
		>
			<div class="flex flex-col items-center">
				<h2 class="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9] text-[var(--text-primary)]">
					{currentProject.title.split(' ')[0]}
				</h2>
				
				<div class="flex items-center gap-6 mt-2 md:-mt-2">
					<div class="w-20 h-20 md:w-32 md:h-32 rounded-3xl overflow-hidden border border-cyber/30 rotate-6 group-hover:rotate-0 transition-all duration-700 shadow-2xl">
						<img src={currentProject.image} alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
					</div>
					<h2 class="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9] text-[var(--text-primary)] opacity-40 group-hover:opacity-100 transition-opacity">
						{currentProject.title.split(' ').slice(1).join(' ') || 'Engine'}
					</h2>
				</div>
			</div>

			<!-- Technical Hint -->
			<div class="mt-5 flex flex-col items-center gap-4">
				<div class="px-6 py-2 rounded-full border border-cyber/30 bg-cyber/5 text-cyber font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
					[ Launch Technical Readout ]
				</div>
			</div>
		</div>

		<!-- Navigation Interface -->
		<div class="mt-5 w-full max-w-xl flex flex-col gap-12">
			<div class="flex justify-between items-end">
				<div class="flex flex-col items-start gap-2">
					<span class="text-[8px] font-mono text-cyber/40 uppercase">Architecture</span>
					<span class="text-[10px] font-mono text-[var(--text-secondary)]">SVELTEKIT_V5</span>
				</div>
				
				<!-- Dots Indicator -->
				<div class="flex gap-2">
					{#each projects as _, i}
						<button 
							onclick={() => currentIndex = i}
							class="w-2 h-2 rounded-full transition-all duration-500 {i === currentIndex ? 'bg-cyber w-8' : 'bg-white/10'}"
						></button>
					{/each}
				</div>

				<div class="flex flex-col items-end gap-2 text-right">
					<span class="text-[8px] font-mono text-cyber/40 uppercase">Index</span>
					<span class="text-[10px] font-mono text-[var(--text-secondary)]">{currentIndex + 1} / {projects.length}</span>
				</div>
			</div>

			<!-- Navigation Paddles -->
			<div class="flex items-center justify-center gap-12">
				<button onclick={prev} class="p-6 rounded-full border border-white/5 hover:border-cyber/30 hover:bg-cyber/5 transition-all group">
					<Icon icon="lucide:arrow-left" class="w-6 h-6 text-[var(--text-secondary)] group-hover:text-cyber" />
				</button>
				<button onclick={next} class="p-6 rounded-full border border-white/5 hover:border-cyber/30 hover:bg-cyber/5 transition-all group">
					<Icon icon="lucide:arrow-right" class="w-6 h-6 text-[var(--text-secondary)] group-hover:text-cyber" />
				</button>
			</div>
		</div>
	</div>

	<!-- Modal Integration -->
	<ProjectModal 
		project={currentProject} 
		isOpen={isModalOpen} 
		onClose={() => isModalOpen = false} 
	/>
</section>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
