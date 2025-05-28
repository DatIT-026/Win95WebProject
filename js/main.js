const $ = _ => document.querySelector(_)

const $c = _ => document.createElement(_)

String.prototype.pad = function(size){
	let s = String(this)
	while (s.length < (size || 2)) {s = "0" + s}
	return s
}

const art3d = $('#art3dicons')
const mainDesktop = $('#mainDesktop')

for(let i = 1; i <= 55; i++){
	const img = new Image()
	const name = (i).toString().pad(3)
	img.src = `3d/${name}.jpg`
	img.onload = () => {
		const icon = $c('fos-icon')
		icon.setAttribute('href', `art3d${name}`)
		icon.setAttribute('fixed', true)
		icon.setAttribute('name', name)
		icon.appendChild(img)
		art3d.appendChild(icon)
		const window = $c('fos-window')
		window.className = 'viewer'
		window.appendChild(img.cloneNode())
		window.setAttribute('title', `3D Art - ${name}`)
		window.setAttribute('name', `art3d${name}`)
		window.style.left = 0
		window.style.top = 0
		window.style.height = Math.min(innerHeight * 0.95, Math.min(innerWidth/img.width,1) * img.height) + 'px'
		mainDesktop.appendChild(window)
	}
}

const time = () => {
	const date = new Date();
	$('#clock').innerHTML = `${date.getHours().toString().pad(2)}:${date.getMinutes().toString().pad(2)}`
	setTimeout( time, 5000 )
}

time()

// Audio control functionality for game iframes
const stopAllGameAudio = () => {
	const gameWindows = ['cmiyc', 'genius', 'invaderz', 'scramble'];
	gameWindows.forEach(gameName => {
		const gameWindow = document.querySelector(`fos-window[name="${gameName}"]`);
		if (gameWindow) {
			const iframe = gameWindow.querySelector('iframe');
			if (iframe) {
				// Stop audio by reloading the iframe src
				const currentSrc = iframe.src;
				iframe.src = 'about:blank';
				// Store original src for later restoration if needed
				iframe.dataset.originalSrc = currentSrc;
			}
		}
	});
};

// restore iframe when window is opened
const restoreGameIframe = (gameName) => {
	const gameWindow = document.querySelector(`fos-window[name="${gameName}"]`);
	if (gameWindow) {
		const iframe = gameWindow.querySelector('iframe');
		if (iframe && iframe.dataset.originalSrc) {
			iframe.src = iframe.dataset.originalSrc;
		}
	}
};

// Add event listeners to game icons to manage audio
document.addEventListener('DOMContentLoaded', () => {
	// Override the original window close function to stop audio
	const originalWindowClose = window.HTMLElement.prototype.close;
	
	// Add click listeners to game icons
	const gameIcons = ['cmiyc', 'genius', 'invaderz', 'scramble'];
	gameIcons.forEach(gameName => {
		const icon = document.querySelector(`fos-icon[href="${gameName}"]`);
		if (icon) {
			icon.addEventListener('dblclick', () => {
				// Restore iframe when opening
				setTimeout(() => restoreGameIframe(gameName), 100);
			});
		}
	});
	
	// Monitor window visibility changes
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
				const target = mutation.target;
				if (target.tagName === 'FOS-WINDOW' && target.style.display === 'none') {
					// Window was closed, stop its audio if it's a game window
					const windowName = target.getAttribute('name');
					if (['cmiyc', 'genius', 'invaderz', 'scramble'].includes(windowName)) {
						const iframe = target.querySelector('iframe');
						if (iframe) {
							const currentSrc = iframe.src;
							iframe.src = 'about:blank';
							iframe.dataset.originalSrc = currentSrc;
						}
					}
				}
			}
		});
	});
	
	const gameWindows = document.querySelectorAll('fos-window[name="cmiyc"], fos-window[name="genius"], fos-window[name="invaderz"], fos-window[name="scramble"]');
	gameWindows.forEach(window => {
		observer.observe(window, { attributes: true, attributeFilter: ['style'] });
	});
});

window.stopAllGameAudio = stopAllGameAudio;