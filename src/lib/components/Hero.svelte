<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';
	import ShaderBackground from './ShaderBackground.svelte';

	let heroRef: HTMLElement;
	let titleRef: HTMLHeadingElement;
	let subTitleRef: HTMLParagraphElement;
	let ctaRef: HTMLDivElement;

	onMount(() => {
		const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

		tl.fromTo(titleRef, 
			{ y: 100, opacity: 0 }, 
			{ y: 0, opacity: 1, delay: 0.5 }
		)
		.fromTo(subTitleRef, 
			{ y: 50, opacity: 0 }, 
			{ y: 0, opacity: 1 }, 
			'-=0.8'
		)
		.fromTo(ctaRef, 
			{ scale: 0.8, opacity: 0 }, 
			{ scale: 1, opacity: 1 }, 
			'-=0.8'
		);
	});
</script>

<section 
	bind:this={heroRef} 
	role="region"
	aria-label="Hero Section"
	class="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
>
	<!-- GLSL Shader Background -->
	<ShaderBackground />

	<!-- Content -->
	<div class="max-w-5xl text-center z-10">
		<h1 bind:this={titleRef} class="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
			Crafting <span class="text-gradient">Immersive</span> <br /> 
			Digital Experiences.
		</h1>
		
		<p bind:this={subTitleRef} class="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
			A full-stack engineer dedicated to building high-performance, 
			visually stunning web applications with Svelte and modern engineering practices.
		</p>
		
		<div bind:this={ctaRef} class="flex flex-col md:flex-row items-center justify-center gap-4">
			<button class="group relative px-8 py-4 bg-cyber text-obsidian font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
				<span class="relative z-10 flex items-center gap-2">
					View My Work <Icon icon="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</span>
			</button>
			
			<button class="px-8 py-4 glass text-white font-medium rounded-full hover:bg-white/10 transition-all">
				Let's Talk
			</button>
		</div>
	</div>
</section>

<style>
	:global(.bg-gradient-circle) {
		will-change: transform;
	}
</style>
