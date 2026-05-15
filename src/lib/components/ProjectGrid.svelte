<script lang="ts">
	import { onMount } from 'svelte';
	import { projects, type Project } from '$lib/data/projects';
	import Icon from '@iconify/svelte';
	import ProjectModal from './ProjectModal.svelte';

	let gridRef: HTMLElement;
	let selectedProject = $state<Project | null>(null);
	let isModalOpen = $state(false);

	function openProject(project: Project) {
		selectedProject = project;
		isModalOpen = true;
	}

	onMount(() => {
		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			
			gsap.registerPlugin(ScrollTrigger);

			const cards = gridRef.querySelectorAll('.project-card');
			
			gsap.from(cards, {
				scrollTrigger: {
					trigger: gridRef,
					start: 'top bottom',
					toggleActions: 'play none none none'
				},
				y: 50,
				duration: 0.8,
				stagger: 0.1,
				ease: 'power2.out'
			});
		};

		init();
	});

	function handleMouseMove(e: MouseEvent, card: HTMLElement) {
		const { left, top, width, height } = card.getBoundingClientRect();
		const x = (e.clientX - left) / width;
		const y = (e.clientY - top) / height;
		
		const moveX = (x - 0.5) * 10;
		const moveY = (y - 0.5) * 10;
		
		gsap.to(card, {
			rotateY: moveX,
			rotateX: -moveY,
			duration: 0.5,
			ease: 'power2.out'
		});

		// Glow effect
		const glow = card.querySelector('.glow') as HTMLElement;
		if (glow) {
			gsap.to(glow, {
				opacity: 1,
				x: (x * 100) - 50 + '%',
				y: (y * 100) - 50 + '%',
				duration: 0.2
			});
		}
	}

	function handleMouseLeave(card: HTMLElement) {
		gsap.to(card, {
			rotateY: 0,
			rotateX: 0,
			duration: 0.8,
			ease: 'elastic.out(1, 0.3)'
		});
		
		const glow = card.querySelector('.glow') as HTMLElement;
		if (glow) {
			gsap.to(glow, { opacity: 0, duration: 0.5 });
		}
	}
</script>

<section id="projects" class="py-24 px-4 bg-theme relative overflow-hidden" bind:this={gridRef}>
	<div class="max-w-7xl mx-auto">
		<div class="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
			<div class="max-w-2xl">
				<h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
					Featured <span class="text-cyber">Projects</span>
				</h2>
				<p class="text-slate text-lg">
					A selection of high-impact digital products, focusing on performance, 
					scalability, and exceptional user experience.
				</p>
			</div>
			<div class="flex gap-4">
				<div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40">
					01
				</div>
				<div class="w-12 h-12 rounded-full border border-cyber/30 flex items-center justify-center text-cyber">
					04
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each projects as project, i}
				<div 
					class="project-card group relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl glass transition-all perspective-1000 cursor-pointer"
					onmousemove={(e) => handleMouseMove(e, e.currentTarget)}
					onmouseleave={(e) => handleMouseLeave(e.currentTarget)}
					onclick={() => openProject(project)}
					role="article"
				>
					<!-- Image Background -->
					<div class="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
						<img src={project.image} alt={project.title} class="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
						<div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent"></div>
					</div>

					<!-- Glow Effect -->
					<div class="glow absolute w-[300px] h-[300px] bg-cyber/20 blur-[100px] rounded-full opacity-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

					<!-- Content -->
					<div class="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10">
						<div class="flex flex-wrap gap-2 mb-4">
							{#each project.tags as tag}
								<span class="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md">
									{tag}
								</span>
							{/each}
						</div>
						
						<h3 class="text-3xl md:text-4xl font-bold mb-4 tracking-tight group-hover:text-cyber transition-colors">
							{project.title}
						</h3>
						
						<p class="text-slate text-sm md:text-base max-w-md opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
							{project.description}
						</p>

						<div class="mt-8 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all delay-100">
							<a href={project.link} class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyber">
								Live Demo <Icon icon="lucide:external-link" class="w-4 h-4" />
							</a>
							<a href={project.github} class="text-white/60 hover:text-white transition-colors">
								<Icon icon="lucide:github" class="w-6 h-6" />
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<ProjectModal 
		project={selectedProject} 
		isOpen={isModalOpen} 
		onClose={() => isModalOpen = false} 
	/>
</section>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	.project-card {
		transform-style: preserve-3d;
	}
</style>
