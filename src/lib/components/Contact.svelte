<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let formRef: HTMLElement;
	let isSubmitting = $state(false);
	let isSuccess = $state(false);

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap.from(formRef, {
			scrollTrigger: {
				trigger: formRef,
				start: 'top 80%'
			},
			y: 50,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		});
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		await new Promise(resolve => setTimeout(resolve, 2000));
		isSubmitting = false;
		isSuccess = true;
		setTimeout(() => isSuccess = false, 5000);
	}
</script>

<section id="contact" class="py-24 px-4 bg-obsidian relative">
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full -z-10 opacity-20 blur-[100px] bg-gradient-to-tr from-cyber/20 via-blue-500/10 to-purple-500/20"></div>

	<div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16" bind:this={formRef}>
		<div class="flex-1">
			<h2 class="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">
				Let's Build Something <span class="text-gradient">Iconic.</span>
			</h2>
			<p class="text-slate text-lg mb-12 max-w-md">
				Currently accepting new projects and collaborations. 
				If you have a vision, I have the tools to make it a reality.
			</p>

			<div class="space-y-6">
				<a href="mailto:hello@velocity.dev" class="flex items-center gap-4 group">
					<div class="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-cyber group-hover:text-obsidian transition-all">
						<Icon icon="lucide:mail" class="w-5 h-5" />
					</div>
					<div>
						<div class="text-xs text-slate font-mono uppercase tracking-widest">Email</div>
						<div class="text-lg font-medium">hello@velocity.dev</div>
					</div>
				</a>
			</div>

			<div class="mt-16 flex gap-4">
				{#each ['github', 'twitter', 'linkedin'] as social}
					<a href="#" class="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-cyber hover:border-cyber transition-all">
						<Icon icon="lucide:{social}" class="w-5 h-5" />
					</a>
				{/each}
			</div>
		</div>

		<div class="flex-1">
			<form onsubmit={handleSubmit} class="glass p-8 md:p-12 rounded-[2rem] border-white/10 space-y-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<label for="name" class="text-xs font-mono uppercase tracking-widest text-slate ml-2">Name</label>
						<input type="text" id="name" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyber/50 transition-all" placeholder="John Doe" />
					</div>
					<div class="space-y-2">
						<label for="email" class="text-xs font-mono uppercase tracking-widest text-slate ml-2">Email</label>
						<input type="email" id="email" required class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyber/50 transition-all" placeholder="john@example.com" />
					</div>
				</div>

				<div class="space-y-2">
					<label for="message" class="text-xs font-mono uppercase tracking-widest text-slate ml-2">Message</label>
					<textarea id="message" required rows="4" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyber/50 transition-all resize-none" placeholder="Tell me about your project..."></textarea>
				</div>

				<button 
					type="submit" 
					disabled={isSubmitting}
					class="w-full py-5 bg-cyber text-obsidian font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isSubmitting}
						<Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin" /> Sending...
					{:else if isSuccess}
						<Icon icon="lucide:check" class="w-5 h-5" /> Sent!
					{:else}
						Transmit Message <Icon icon="lucide:send" class="w-5 h-5" />
					{/if}
				</button>
			</form>
		</div>
	</div>
</section>
