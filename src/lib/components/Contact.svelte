<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let formRef: HTMLElement;
	let sectionRef: HTMLElement;
	let isSubmitting = $state(false);
	let isSuccess = $state(false);
	let errorMessage = $state('');

	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	// Ambient "Velocity Orbs" for Contact
	let orbs = $state(Array.from({ length: 8 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: 20 + Math.random() * 40,
		color: ['#00ff9d', '#00e5ff', '#9d00ff', '#ff0066'][Math.floor(Math.random() * 4)],
		vx: (Math.random() - 0.5) * 0.05,
		vy: (Math.random() - 0.5) * 0.05,
	})));

	function handleInteraction(e: MouseEvent) {
		const rect = sectionRef.getBoundingClientRect();
		const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
		const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

		orbs.forEach(orb => {
			const dx = orb.x - mouseX;
			const dy = orb.y - mouseY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 15) {
				const force = (15 - dist) / 15;
				orb.vx += (dx / dist) * force * 0.5;
				orb.vy += (dy / dist) * force * 0.5;
			}
		});
	}

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Physics Loop
		let frame: number;
		const loop = () => {
			orbs.forEach(orb => {
				orb.x += orb.vx;
				orb.y += orb.vy;
				orb.vx *= 0.99;
				orb.vy *= 0.99;
				if (orb.x < 0 || orb.x > 100) orb.vx *= -1;
				if (orb.y < 0 || orb.y > 100) orb.vy *= -1;
			});
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);

		// Scroll Animations
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: formRef,
				start: 'top 80%'
			}
		});

		tl.from('.contact-content > *', {
			y: 50,
			opacity: 0,
			duration: 1,
			stagger: 0.15,
			ease: 'power3.out'
		}).from('.contact-form', {
			y: 50,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		}, '-=0.8');

		return () => cancelAnimationFrame(frame);
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
			errorMessage = 'Connection lost. Try again later.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section 
	id="contact" 
	bind:this={sectionRef}
	onmousemove={handleInteraction}
	onclick={handleInteraction}
	class="py-32 px-6 bg-theme relative overflow-hidden transition-colors duration-1000"
>
	<!-- Ambient Orbs Background -->
	<div class="absolute inset-0 pointer-events-none z-0">
		{#each orbs as orb (orb.id)}
			<div 
				class="absolute rounded-full blur-[5px] opacity-30 shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-transform duration-1000 border border-white/10"
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

	<div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10" bind:this={formRef}>
		<!-- Left: Typography & Info -->
		<div class="flex-1 contact-content flex flex-col justify-center">
			<div class="mb-12 flex items-center gap-4 opacity-40">
				<div class="w-8 h-[1px] bg-[var(--text-primary)]"></div>
				<span class="text-[10px] font-mono tracking-[0.6em] text-[var(--text-secondary)] uppercase">
					Initiate_Contact
				</span>
			</div>

			<h2 class="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.8] uppercase text-[var(--text-primary)] mb-10">
				Build <br/> 
				<span class="opacity-40">Iconic.</span>
			</h2>
			
			<p class="text-[var(--text-secondary)] text-lg md:text-xl mb-16 max-w-md leading-relaxed font-medium">
				Currently accepting new projects and collaborations. 
				If you have a vision, I have the engineering to make it a reality.
			</p>

			<div class="space-y-8">
				<a href="mailto:hello@velocity.dev" class="flex items-center gap-6 group">
					<div class="w-16 h-16 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] group-hover:scale-105 transition-all duration-500">
						<Icon icon="lucide:mail" class="w-6 h-6" />
					</div>
					<div>
						<div class="text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-[0.2em] mb-1 group-hover:text-cyber transition-colors">Direct Line</div>
						<div class="text-xl font-bold text-[var(--text-primary)] group-hover:text-cyber transition-colors">hello@velocity.dev</div>
					</div>
				</a>

				<a href="https://calendly.com" target="_blank" class="flex items-center gap-6 group">
					<div class="w-16 h-16 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] group-hover:scale-105 transition-all duration-500">
						<Icon icon="lucide:calendar" class="w-6 h-6" />
					</div>
					<div>
						<div class="text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-[0.2em] mb-1 group-hover:text-blue-400 transition-colors">Scheduling</div>
						<div class="text-xl font-bold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">Book a Consultation</div>
					</div>
				</a>
			</div>
		</div>

		<!-- Right: Minimalist Form -->
		<div class="flex-1 contact-form w-full max-w-xl lg:max-w-none mx-auto">
			<form onsubmit={handleSubmit} class="bg-[var(--glass-bg)] p-8 md:p-14 rounded-[2rem] border border-[var(--glass-border)] space-y-10 relative overflow-hidden shadow-2xl backdrop-blur-xl">
				{#if isSuccess}
					<div class="absolute inset-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-700">
						<div class="w-24 h-24 bg-[var(--text-primary)] rounded-full flex items-center justify-center mb-8 shadow-2xl scale-in">
							<Icon icon="lucide:check" class="w-12 h-12 text-[var(--bg-primary)]" />
						</div>
						<h3 class="text-4xl font-black mb-4 uppercase tracking-tighter text-[var(--text-primary)]">Message <br/> Received</h3>
						<p class="text-[var(--text-secondary)] max-w-xs text-sm">Your vision has been securely transmitted. I will be in touch shortly.</p>
						<button onclick={() => isSuccess = false} class="mt-10 px-8 py-3 rounded-full border border-[var(--glass-border)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all">
							Send Another
						</button>
					</div>
				{/if}

				<div class="space-y-8">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div class="space-y-3 group">
							<label for="name" class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-4 group-focus-within:text-cyber transition-colors">Name</label>
							<input 
								type="text" 
								id="name" 
								required 
								bind:value={formData.name}
								class="w-full bg-[var(--bg-primary)]/50 border border-[var(--glass-border)] rounded-2xl px-6 py-5 outline-none focus:border-cyber focus:bg-[var(--bg-primary)] transition-all text-[var(--text-primary)] placeholder-white/10 dark:placeholder-white/20" 
								placeholder="Jane Doe" 
							/>
						</div>
						<div class="space-y-3 group">
							<label for="email" class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-4 group-focus-within:text-cyber transition-colors">Email</label>
							<input 
								type="email" 
								id="email" 
								required 
								bind:value={formData.email}
								class="w-full bg-[var(--bg-primary)]/50 border border-[var(--glass-border)] rounded-2xl px-6 py-5 outline-none focus:border-cyber focus:bg-[var(--bg-primary)] transition-all text-[var(--text-primary)] placeholder-white/10 dark:placeholder-white/20" 
								placeholder="jane@example.com" 
							/>
						</div>
					</div>

					<div class="space-y-3 group">
						<label for="message" class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-4 group-focus-within:text-cyber transition-colors">Message</label>
						<textarea 
							id="message" 
							required 
							bind:value={formData.message}
							rows="5" 
							class="w-full bg-[var(--bg-primary)]/50 border border-[var(--glass-border)] rounded-2xl px-6 py-5 outline-none focus:border-cyber focus:bg-[var(--bg-primary)] transition-all resize-none text-[var(--text-primary)] placeholder-white/10 dark:placeholder-white/20" 
							placeholder="Tell me about your vision..."
						></textarea>
					</div>
				</div>

				{#if errorMessage}
					<p class="text-red-400 text-xs font-bold text-center bg-red-400/10 py-3 rounded-lg border border-red-400/20">{errorMessage}</p>
				{/if}

				<button 
					type="submit" 
					disabled={isSubmitting}
					class="w-full py-6 bg-cyber text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,157,0.2)] hover:shadow-[0_0_50px_rgba(0,255,157,0.4)]"
				>
					{#if isSubmitting}
						<Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin" /> SENDING...
					{:else}
						TRANSMIT MESSAGE <Icon icon="lucide:arrow-right" class="w-5 h-5" />
					{/if}
				</button>
			</form>
		</div>
	</div>
</section>

