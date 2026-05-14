<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';
	import ShaderBackground from './ShaderBackground.svelte';
	import HeroTerminal from './HeroTerminal.svelte';

	let heroRef: HTMLElement;
	let badgeRef: HTMLDivElement;
	let titleRef: HTMLHeadingElement;
	let subTitleRef: HTMLParagraphElement;
	let ctaRef: HTMLDivElement;
	let socialRef: HTMLDivElement;

	onMount(() => {
		const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });

		const titleSpans = titleRef.querySelectorAll('.anim-text');

		tl.fromTo(badgeRef, 
			{ y: 30, opacity: 0 }, 
			{ y: 0, opacity: 1, delay: 0.2 }
		)
		.fromTo(titleSpans, 
			{ y: 150, opacity: 0, rotateZ: 5 }, 
			{ y: 0, opacity: 1, rotateZ: 0, stagger: 0.1 }, 
			'-=1.2'
		)
		.fromTo(subTitleRef, 
			{ y: 50, opacity: 0 }, 
			{ y: 0, opacity: 1 }, 
			'-=1.2'
		)
		.fromTo(ctaRef, 
			{ y: 30, opacity: 0 }, 
			{ y: 0, opacity: 1 }, 
			'-=1.2'
		)
		.fromTo(socialRef.children, 
			{ scale: 0, opacity: 0 }, 
			{ scale: 1, opacity: 1, stagger: 0.1, ease: 'back.out(1.5)' }, 
			'-=1.2'
		);
	});
</script>

<section 
	bind:this={heroRef} 
	role="region"
	aria-label="Hero Section"
	class="relative min-h-screen flex items-center overflow-hidden px-4 pt-24 pb-16"
>
	<!-- GLSL Shader Background -->
	<ShaderBackground />

	<!-- Content -->
	<div class="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
		<div class="lg:col-span-8 flex flex-col items-center md:items-start text-center md:text-left">
			
			<!-- Name / Title Badge -->
			<div bind:this={badgeRef} class="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-cyber/30 mb-8">
				<span class="relative flex h-3 w-3">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber opacity-75"></span>
					<span class="relative inline-flex rounded-full h-3 w-3 bg-cyber"></span>
				</span>
				<span class="text-xs md:text-sm font-mono tracking-widest uppercase text-cyber">Hi, I'm ZEE — Frontend Developer</span>
			</div>

			<!-- Main Title -->
			<h1 bind:this={titleRef} class="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter mb-8 leading-tight">
				<div class="inline-block"><span class="anim-text block">Building</span></div>
				<div class="inline-block"><span class="anim-text block text-gradient">Digital</span></div>
				<br class="hidden md:block" />
				<div class="inline-block"><span class="anim-text block">Experiences.</span></div>
			</h1>
			
			<!-- Introduction -->
			<p bind:this={subTitleRef} class="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mb-10 font-sans leading-relaxed">
				I'm a frontend developer who loves turning complex problems into simple, beautiful, and intuitive interface designs.

Get in touch to create something amazing.
			</p>
			
			<!-- CTAs -->
			<div bind:this={ctaRef} class="flex flex-col sm:flex-row items-center gap-6 mb-8 w-full md:w-auto">
				<a href="#contact" class="w-full sm:w-auto group relative px-8 py-4 bg-cyber text-obsidian font-semibold uppercase tracking-wider text-sm rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,157,0.4)] active:scale-95 flex items-center justify-center gap-3">
					<span class="relative z-10 flex items-center gap-2">
						Start a Project <Icon icon="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</span>
				</a>
				
				<a href="/resume.pdf" target="_blank" class="w-full sm:w-auto group px-8 py-4 glass text-white font-semibold uppercase tracking-wider text-sm rounded-full hover:bg-white/10 hover:border-cyber/30 transition-all duration-300 flex items-center justify-center gap-3">
					<Icon icon="lucide:download" class="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
					Download Resume
				</a>
			</div>

			<!-- Social Links -->
			<div bind:this={socialRef} class="flex items-center gap-4">
				<a href="https://github.com/xieumar" target="_blank" class="group h-12 w-12 hover:w-[120px] rounded-full glass flex items-center text-slate hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden" aria-label="GitHub">
					<div class="flex items-center justify-center w-12 h-12 shrink-0">
						<Icon icon="mdi:github" class="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
					</div>
					<span class="font-bold text-sm whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">GitHub</span>
				</a>
				<a href="https://www.linkedin.com/in/zainab-umar-ibrahim-48929b1ba/" target="_blank" class="group h-12 w-12 hover:w-[125px] rounded-full glass flex items-center text-slate hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden" aria-label="LinkedIn">
					<div class="flex items-center justify-center w-12 h-12 shrink-0">
						<Icon icon="mdi:linkedin" class="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
					</div>
					<span class="font-bold text-sm whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">LinkedIn</span>
				</a>
				<a href="https://twitter.com/xiaoma0_" target="_blank" class="group h-12 w-12 hover:w-[110px] rounded-full glass flex items-center text-slate hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden" aria-label="Twitter">
					<div class="flex items-center justify-center w-12 h-12 shrink-0">
						<Icon icon="ri:twitter-x-fill" class="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
					</div>
					<span class="font-bold text-sm whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">Twitter</span>
				</a>
				<a href="mailto:xieumar@gmail.com" class="group h-12 w-12 hover:w-[105px] rounded-full glass flex items-center text-slate hover:text-cyber hover:border-cyber/50 hover:bg-cyber/10 transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden" aria-label="Email">
					<div class="flex items-center justify-center w-12 h-12 shrink-0">
						<Icon icon="lucide:mail" class="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
					</div>
					<span class="font-bold text-sm whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">Email</span>
				</a>
			</div>
		</div>

		<!-- Right Side: Interactive Terminal -->
		<div class="hidden lg:block lg:col-span-4 w-full perspective-[1000px]">
			<HeroTerminal />
		</div>
	</div>
</section>

<style>
	:global(.bg-gradient-circle) {
		will-change: transform;
	}
	.anim-text {
		display: block;
		transform-origin: left bottom;
		padding-bottom: 0.2em; 
		margin-bottom: -0.2em;	}
</style>
