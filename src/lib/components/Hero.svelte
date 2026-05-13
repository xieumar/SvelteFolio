<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';

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

	function handleMouseMove(e: MouseEvent) {
		const { clientX, clientY } = e;
		const { innerWidth, innerHeight } = window;
		
		// Subtle background parallax
		const moveX = (clientX / innerWidth - 0.5) * 30;
		const moveY = (clientY / innerHeight - 0.5) * 30;
		
		gsap.to('.bg-gradient-circle', {
			x: moveX,
			y: moveY,
			duration: 2,
			ease: 'power2.out',
			stagger: 0.1
		});
	}
</script>

<section 
	bind:this={heroRef} 
	onmousemove={handleMouseMove}
	role="region"
	aria-label="Hero Section"
	class="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
>
	<!-- Animated Background -->
	<div class="absolute inset-0 -z-10 bg-obsidian">
		<div class="bg-gradient-circle absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber/20 blur-[120px] rounded-full"></div>
		<div class="bg-gradient-circle absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full"></div>
		<div class="bg-gradient-circle absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full"></div>
	</div>

	<!-- Content -->
	<div class="max-w-5xl text-center z-10">
		<h1 bind:this={titleRef} class="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
			Crafting <span class="text-gradient">Immersive</span> <br /> 
			Digital Experiences.
		</h1>
		
		<p bind:this={subTitleRef} class="text-slate text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
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
