<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Icon from '@iconify/svelte';

	let containerRef: HTMLElement;
	let terminalRef: HTMLElement;
	let statsRef: HTMLElement;

	const skills = [
		{ name: 'SvelteKit', level: 95, color: '#ff3e00', icon: 'vscode-icons:file-type-svelte' },
		{ name: 'TypeScript', level: 90, color: '#3178c6', icon: 'vscode-icons:file-type-typescript-official' },
		{ name: 'GSAP / Motion', level: 98, color: '#88ce02', icon: 'logos:gsap' },
		{ name: 'Rust / WASM', level: 75, color: '#dea584', icon: 'vscode-icons:file-type-rust' }
	];

	const technicalDNA = {
		core: ["Architecture", "Reactivity", "Animation", "Performance"],
		philosophy: "Build for the user, engineer for the machine.",
		status: "Operational"
	};

	let typedText = $state('');
	const fullText = JSON.stringify(technicalDNA, null, 2);

	onMount(() => {
		let interval: NodeJS.Timeout;

		const init = async () => {
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			// Typing Animation
			let i = 0;
			interval = setInterval(() => {
				typedText += fullText[i];
				i++;
				if (i >= fullText.length) clearInterval(interval);
			}, 30);

			// Section Entrance
			gsap.from(containerRef, {
				scrollTrigger: {
					trigger: containerRef,
					start: 'top 80%',
					toggleActions: 'play none none reverse'
				},
				opacity: 0,
				y: 100,
				duration: 1.5,
				ease: 'expo.out'
			});

			// Staggered Stats Reveal
			gsap.from('.stat-row', {
				scrollTrigger: {
					trigger: statsRef,
					start: 'top 85%'
				},
				x: -50,
				opacity: 0,
				stagger: 0.2,
				duration: 1,
				ease: 'power4.out'
			});
		};

		init();

		return () => interval && clearInterval(interval);
	});
</script>

<section id="about" bind:this={containerRef} class="py-32 px-4 bg-theme relative overflow-hidden">
	<!-- Background HUD Grid -->
	<div class="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

	<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
		<!-- Left: Terminal DNA -->
		<div class="relative group">
			<div class="absolute -inset-4 bg-cyber/5 rounded-3xl blur-2xl group-hover:bg-cyber/10 transition-all"></div>
			<div class="relative glass rounded-3xl overflow-hidden border-white/5">
				<!-- Terminal Header -->
				<div class="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
					<div class="flex gap-2">
						<div class="w-3 h-3 rounded-full bg-red-500/50"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
						<div class="w-3 h-3 rounded-full bg-green-500/50"></div>
					</div>
					<div class="text-[10px] font-mono text-slate uppercase tracking-widest">system_identity.json</div>
				</div>
				<!-- Terminal Content -->
				<div class="p-8 font-mono text-sm leading-relaxed min-h-[300px]">
					<pre class="text-cyber"><code>{typedText}<span class="animate-pulse">_</span></code></pre>
				</div>
			</div>
		</div>

		<!-- Right: System Metrics -->
		<div bind:this={statsRef} class="space-y-12">
			<div>
				<h2 class="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
					Engineered for <br />
					<span class="text-gradient">Performance.</span>
				</h2>
				<p class="text-slate text-lg max-w-md">
					I don't just build websites. I architect digital environments where motion, 
					logic, and design converge into a single high-performance system.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8">
				{#each skills as skill}
					<div class="stat-row group">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-3">
								<Icon icon={skill.icon} class="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
								<span class="text-sm font-bold uppercase tracking-widest text-white/80">{skill.name}</span>
							</div>
							<span class="text-[10px] font-mono text-cyber">{skill.level}%</span>
						</div>
						<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
							<div 
								class="h-full rounded-full transition-all duration-1000"
								style="width: {skill.level}%; background: linear-gradient(to right, {skill.color}, #00ff9d);"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Interaction Prompt -->
			<div class="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-6 group hover:border-cyber/30 transition-all">
				<div class="w-12 h-12 rounded-full glass flex items-center justify-center text-cyber group-hover:rotate-[360deg] transition-all duration-1000">
					<Icon icon="lucide:zap" class="w-6 h-6" />
				</div>
				<p class="text-xs text-slate font-mono leading-relaxed">
					[SYSTEM NOTICE]: Low-latency interactions and optimized bundle sizes are 
					standard across all deployed modules.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.text-gradient {
		background: linear-gradient(to right, #fff, #00ff9d);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
