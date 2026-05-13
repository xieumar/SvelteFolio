import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

function createTheme() {
	let currentTheme = $state<Theme>('dark');

	if (browser) {
		const stored = localStorage.getItem('theme') as Theme;
		if (stored) {
			currentTheme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			currentTheme = 'light';
		}
	}

	return {
		get current() { return currentTheme; },
		toggle() {
			currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
			if (browser) {
				localStorage.setItem('theme', currentTheme);
				document.documentElement.classList.toggle('light', currentTheme === 'light');
			}
		},
		set(theme: Theme) {
			currentTheme = theme;
			if (browser) {
				localStorage.setItem('theme', theme);
				document.documentElement.classList.toggle('light', theme === 'light');
			}
		}
	};
}

export const theme = createTheme();
