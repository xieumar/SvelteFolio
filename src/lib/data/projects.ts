export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	link: string;
	github: string;
	color: string;
}

export const projects: Project[] = [
	{
		id: '1',
		title: 'Habit Tracker',
		description: 'Progressive Web App (PWA) designed to help users build and maintain positive rituals through focused tracking and streak management.',
		tags: ['Next', 'TypeScript', 'Tailwind', 'PWA'],
		image: '/projects/habit-tracker.png',
		link: 'https://habit-tracker14.vercel.app/',
		github: 'https://github.com/xieumar/Habit-Tracker',
		color: '#3b82f6'
	},
	{
		id: '2',
		title: 'Invoice App',
		description: 'A modern invoice management application focused on providing a complete lifecycle for invoice management, featuring full CRUD capabilities, draft handling, status tracking, seamless theming, and a fully responsive interface.',
		tags: ['Next Js', 'TypeScript', 'Tailwind'],
		image: '/projects/invio.png',
		link: 'https://invio14.vercel.app/',
		github: 'https://github.com/xieumar/Invio',
		color: '#a855f7'
	},
	{
		id: '3',
		title: 'Nexus',
		description: 'Next-generation cloud infrastructure monitoring tool with predictive analytics and automated scaling logic.',
		tags: ['Vue', 'Nuxt Js', 'Tailwind'],
		image: '/projects/nexus.png',
		link: '#',
		github: 'https://github.com/xieumar/Nexus',
		color: '#f97316'
	},
	{
		id: '4',
		title: 'Tourify app',
		description: 'Monorepo housing the Tourify Next.js web platform and embeddable Vite-powered Shepherd tour widget.',
		tags: ['Next', 'ShepherdJS', 'TypeScript', 'Tailwind'],
		image: '/projects/tourify.png',
		link: 'https://tour-app-virid-kappa.vercel.app/',
		github: 'https://github.com/DammyCodes-all/tour_app',
		color: '#f97316'
	}
];
