<script lang="ts">
	import { onMount } from 'svelte';
	import { projects } from '$lib/data/projects';
	import Icon from '@iconify/svelte';

	let sectionRef: HTMLElement;
	let wrapperRef: HTMLElement;

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Ensure GSAP finds the slides inside our wrapper
		const sections = Array.from(wrapperRef.children);
		
		const mainTween = gsap.to(sections, {
			xPercent: -100 * (sections.length - 1),
			ease: "none",
			scrollTrigger: {
				trigger: sectionRef,
				pin: true,
				scrub: 1,
				snap: 1 / (sections.length - 1),
				// Distance based on total width of slides
				end: () => "+=" + (wrapperRef.scrollWidth - window.innerWidth)
			}
		});

		// Parallax image reveals
		sections.forEach((slide: any) => {
			const img = slide.querySelector('.slide-img');
			if (img) {
				gsap.fromTo(img, 
					{ scale: 1.4, x: -50 },
					{ 
						scale: 1, 
						x: 50,
						ease: "none",
						scrollTrigger: {
							trigger: slide,
							containerAnimation: mainTween,
							start: "left right",
							end: "right left",
							scrub: true
						}
					}
				);
			}
		});

		ScrollTrigger.refresh();
	});
</script>

<section bind:this={sectionRef} class="relative h-screen bg-black overflow-hidden">
	<div bind:this={wrapperRef} class="flex flex-nowrap h-full h-screen" style="width: {projects.length * 100}vw">
		{#each projects as project, i}
			<div class="project-slide relative w-screen h-screen flex-shrink-0 flex items-center justify-center p-8 md:p-24 overflow-hidden border-r border-white/5">
				<!-- Ambient Glow -->
				<div class="absolute inset-0 -z-10 opacity-20 blur-[150px]" style="background: radial-gradient(circle at 70% 30%, {project.color} 0%, transparent 70%);"></div>

				<!-- Parallax Image -->
				<div class="absolute inset-0 -z-20 overflow-hidden">
					<img src={project.image} alt={project.title} class="slide-img w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" />
					<div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
				</div>

				<!-- Content Layer -->
				<div class="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
					<div class="slide-content">
						<div class="flex items-center gap-4 mb-8">
							<div class="w-12 h-[2px] bg-cyber"></div>
							<span class="text-cyber font-mono text-sm uppercase tracking-[0.4em]">Project 0{i + 1}</span>
						</div>

						<h2 class="text-6xl md:text-9xl font-bold mb-8 tracking-tighter leading-none uppercase">
							{project.title.split(' ')[0]} <br />
							<span class="text-white/20">{project.title.split(' ').slice(1).join(' ')}</span>
						</h2>

						<p class="text-slate text-lg md:text-xl max-w-lg mb-12 leading-relaxed">
							{project.description}
						</p>

						<div class="flex flex-wrap gap-3 mb-12">
							{#each project.tags as tag}
								<span class="px-4 py-2 rounded-full glass border-white/10 text-xs font-mono text-white/60">
									{tag}
								</span>
							{/each}
						</div>

						<div class="flex items-center gap-8">
							<a href={project.link} class="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-cyber hover:text-white transition-colors">
								View Site <div class="w-12 h-12 rounded-full border border-cyber flex items-center justify-center group-hover:bg-cyber group-hover:text-obsidian transition-all"><Icon icon="lucide:arrow-right" class="w-5 h-5" /></div>
							</a>
							<a href={project.github} class="text-white/40 hover:text-white transition-colors">
								<Icon icon="lucide:github" class="w-8 h-8" />
							</a>
						</div>
					</div>

					<!-- Technical Readout (Floating) -->
					<div class="hidden lg:block relative">
						<div class="p-12 glass rounded-[3rem] border-white/5 relative overflow-hidden group">
							<div class="absolute top-0 right-0 p-8 font-mono text-[8px] text-cyber/30">MODULE_LOADED_OK</div>
							<h4 class="text-xs font-mono text-cyber mb-8 uppercase tracking-widest">Tech Stack Performance</h4>
							
							<div class="space-y-6">
								{#each project.tags.slice(0, 3) as tag}
									<div class="space-y-2">
										<div class="flex justify-between text-[10px] font-mono text-white/40 uppercase">
											<span>{tag}</span>
											<span>{(Math.random() * 20 + 80).toFixed(0)}%</span>
										</div>
										<div class="h-[1px] w-full bg-white/10">
											<div class="h-full bg-cyber w-[85%] shadow-[0_0_10px_#00ff9d]"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
