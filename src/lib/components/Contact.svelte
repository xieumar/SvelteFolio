<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let formRef: HTMLElement;
	let isSubmitting = $state(false);
	let isSuccess = $state(false);
	let errorMessage = $state('');

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: formRef,
				start: 'top 80%'
			}
		});

		tl.from('.contact-content > *', {
			x: -50,
			opacity: 0,
			duration: 1,
			stagger: 0.2,
			ease: 'power3.out'
		}).from('.contact-form', {
			x: 50,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		}, '-=0.8');
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		isSubmitting = true;
		errorMessage = '';
		
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const result = await response.json();

			if (response.ok) {
				isSuccess = true;
				formData = { name: '', email: '', message: '' };
				setTimeout(() => isSuccess = false, 5000);
			} else {
				errorMessage = result.error || 'Transmission failed.';
			}
		} catch (err) {
			errorMessage = 'Orbital link lost. Try again later.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="py-24 px-4 bg-obsidian relative overflow-hidden">
	<!-- Background Ambient Glow -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full -z-10 opacity-30 blur-[120px] bg-gradient-to-tr from-cyber/30 via-blue-500/10 to-purple-500/20"></div>

	<div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16" bind:this={formRef}>
		<div class="flex-1 contact-content">
			<h2 class="text-4xl md:text-7xl font-bold mb-8 tracking-tighter leading-tight">
				Let's Build Something <span class="text-gradient">Iconic.</span>
			</h2>
			<p class="text-slate text-xl mb-12 max-w-md leading-relaxed">
				Currently accepting new projects and collaborations. 
				If you have a vision, I have the tools to make it a reality.
			</p>

			<div class="space-y-8">
				<a href="mailto:hello@velocity.dev" class="flex items-center gap-6 group">
					<div class="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:bg-cyber group-hover:text-obsidian group-hover:scale-110 transition-all duration-500 shadow-lg shadow-cyber/0 group-hover:shadow-cyber/20">
						<Icon icon="lucide:mail" class="w-6 h-6" />
					</div>
					<div>
						<div class="text-xs text-cyber font-mono uppercase tracking-[0.2em] mb-1">Direct Line</div>
						<div class="text-xl font-medium group-hover:text-cyber transition-colors">hello@velocity.dev</div>
					</div>
				</a>

				<a href="https://calendly.com" target="_blank" class="flex items-center gap-6 group">
					<div class="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-500/0 group-hover:shadow-blue-500/20">
						<Icon icon="lucide:calendar" class="w-6 h-6" />
					</div>
					<div>
						<div class="text-xs text-blue-400 font-mono uppercase tracking-[0.2em] mb-1">Scheduling</div>
						<div class="text-xl font-medium group-hover:text-blue-400 transition-colors">Book a Consultation</div>
					</div>
				</a>
			</div>

			<div class="mt-16 flex gap-6">
				{#each [
					{ id: 'github', icon: 'lucide:github', url: '#' },
					{ id: 'twitter', icon: 'lucide:twitter', url: '#' },
					{ id: 'linkedin', icon: 'lucide:linkedin', url: '#' }
				] as social}
					<a href={social.url} class="w-12 h-12 rounded-xl glass flex items-center justify-center hover:text-cyber hover:border-cyber/50 hover:-translate-y-1 transition-all duration-300">
						<Icon icon={social.icon} class="w-6 h-6" />
					</a>
				{/each}
			</div>
		</div>

		<div class="flex-1 contact-form">
			<form onsubmit={handleSubmit} class="glass p-8 md:p-12 rounded-[2.5rem] border-white/5 space-y-8 relative overflow-hidden">
				{#if isSuccess}
					<div class="absolute inset-0 bg-obsidian/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
						<div class="w-20 h-20 bg-cyber rounded-full flex items-center justify-center mb-6">
							<Icon icon="lucide:check" class="w-10 h-10 text-obsidian" />
						</div>
						<h3 class="text-3xl font-bold mb-4">Transmission Successful</h3>
						<p class="text-slate max-w-xs">Your message has been encrypted and sent to my terminal. Expect a response shortly.</p>
						<button onclick={() => isSuccess = false} class="mt-8 text-cyber font-mono uppercase tracking-widest text-sm hover:underline">Send Another</button>
					</div>
				{/if}

				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2 group">
							<label for="name" class="text-[10px] font-mono uppercase tracking-[0.3em] text-slate ml-2 group-focus-within:text-cyber transition-colors">Name</label>
							<div class="relative">
								<input 
									type="text" 
									id="name" 
									required 
									bind:value={formData.name}
									class="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all" 
									placeholder="John Doe" 
								/>
							</div>
						</div>
						<div class="space-y-2 group">
							<label for="email" class="text-[10px] font-mono uppercase tracking-[0.3em] text-slate ml-2 group-focus-within:text-cyber transition-colors">Email</label>
							<input 
								type="email" 
								id="email" 
								required 
								bind:value={formData.email}
								class="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all" 
								placeholder="john@example.com" 
							/>
						</div>
					</div>

					<div class="space-y-2 group">
						<label for="message" class="text-[10px] font-mono uppercase tracking-[0.3em] text-slate ml-2 group-focus-within:text-cyber transition-colors">Message</label>
						<textarea 
							id="message" 
							required 
							bind:value={formData.message}
							rows="5" 
							class="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all resize-none" 
							placeholder="Tell me about your project..."
						></textarea>
					</div>
				</div>

				{#if errorMessage}
					<p class="text-red-400 text-sm font-mono text-center">{errorMessage}</p>
				{/if}

				<button 
					type="submit" 
					disabled={isSubmitting}
					class="w-full py-5 bg-cyber text-obsidian font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
				>
					<div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
					<span class="relative z-10 flex items-center gap-3">
						{#if isSubmitting}
							<Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin" /> ESTABLISHING LINK...
						{:else}
							TRANSMIT MESSAGE <Icon icon="lucide:send" class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
						{/if}
					</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	@reference "../../routes/layout.css";

	.text-gradient {
		@apply bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-cyber;
	}

	/* Micro-interactions for form */
	input:focus + .label,
	textarea:focus + .label {
		color: #00ff9d;
	}
</style>
