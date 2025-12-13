const $ = _ => document.querySelector(_)
const $c = _ => document.createElement(_)

String.prototype.pad = function (size) {
	let s = String(this)
	while (s.length < (size || 2)) { s = "0" + s }
	return s
}

const art3d = $('#art3dicons');
let totalImages = 0;
let currentImageIndex = 0;
let loadedImages = [];

function imageExists(url) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = url;
	});
}

const customFileNames = [
	"new-me.jpg",
	"comic.jpg"
];

async function detectImages() {
	const foundImages = [];
	const maxCheck = 11;
	const batchSize = 10;

	if (art3d) {
		art3d.innerHTML = '<div style="padding: 20px; text-align: center; font-family: MS Sans Serif; color: #808080;">Loading images...</div>';
	}

	let numericImages = [];
	for (let start = 1; start <= maxCheck; start += batchSize) {
		const promises = [];
		for (let i = start; i < start + batchSize && i <= maxCheck; i++) {
			const name = i.toString();
			const imgPath = `3d/${name}.jpg`;
			promises.push(
				imageExists(imgPath).then(exists => ({
					exists: exists,
					path: imgPath,
					name: name,
					displayName: `${name}.jpg`
				}))
			);
		}
		const results = await Promise.all(promises);
		const validBatch = results.filter(r => r.exists);
		numericImages = numericImages.concat(validBatch);

		if (validBatch.length === 0 && numericImages.length > 5) break;
	}

	const customPromises = customFileNames.map(fileName => {
		const imgPath = `3d/${fileName}`;
		return imageExists(imgPath).then(exists => ({
			exists: exists,
			path: imgPath,
			name: fileName,
			displayName: fileName
		}));
	});

	const customResults = await Promise.all(customPromises);
	const validCustomImages = customResults.filter(r => r.exists);

	loadedImages = [...numericImages, ...validCustomImages];
	totalImages = loadedImages.length;

	return totalImages;
}

function createThumbnails() {
	if (!art3d) return;

	art3d.innerHTML = '';

	loadedImages.forEach((imgData, arrayIndex) => {
		const icon = $c('fos-icon');
		icon.setAttribute('data-array-index', arrayIndex);
		icon.setAttribute('tabindex', '0');

		const img = new Image();
		img.src = imgData.path;
		img.alt = imgData.displayName;
		img.loading = "lazy";
		img.onerror = function () {
			this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ccc" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
		};

		icon.appendChild(img);
		art3d.appendChild(icon);

		const openViewer = () => {
			openImageViewer(arrayIndex);
		};

		icon.addEventListener('click', openViewer);
		icon.addEventListener('dblclick', openViewer);

		icon.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openViewer();
			}
		});
	});

	updateStatusBar();
}

function updateStatusBar() {
	const statusBar = document.querySelector('.folder-statusbar');
	if (statusBar) statusBar.textContent = `${totalImages} object(s)`;
}

function openImageViewer(arrayIndex) {
	currentImageIndex = arrayIndex;
	updateViewerContent();

	const viewerWindow = document.querySelector('fos-window[name="imgviewer"]');
	if (viewerWindow) {
		viewerWindow.style.display = 'block';
		viewerWindow.bringFront();

		viewerWindow.style.zIndex = '1000';

		const albumWindow = document.querySelector('fos-window[name="art3d"]');
		if (albumWindow) {
			albumWindow.style.zIndex = '950';
		}
	}
}

function updateViewerContent() {
	if (currentImageIndex >= totalImages) currentImageIndex = 0;
	if (currentImageIndex < 0) currentImageIndex = totalImages - 1;

	const currentImage = loadedImages[currentImageIndex];
	if (!currentImage) return;

	// update img
	const displayImg = document.getElementById('main-display-img');
	if (displayImg) {
		displayImg.src = currentImage.path;
		displayImg.alt = currentImage.displayName;

		displayImg.onerror = function () {
			this.alt = 'Image not found';
			this.style.backgroundColor = '#ccc';
		};
	}

	const counter = document.getElementById('img-counter');
	if (counter) {
		counter.textContent = `${currentImageIndex + 1}/${totalImages}`;
	}

	// window title
	const viewerWindow = document.querySelector('fos-window[name="imgviewer"]');
	if (viewerWindow) {
		viewerWindow.setAttribute('title', `Image Viewer - ${currentImage.displayName}`);
		const titleBar = viewerWindow.shadowRoot?.querySelector('#winTitle');
		if (titleBar) {
			titleBar.textContent = `Image Viewer - ${currentImage.displayName}`;
		}
	}
}

// next/pre
window.changeImage = (direction) => {
	currentImageIndex += direction;
	updateViewerContent();

	const viewerWindow = document.querySelector('fos-window[name="imgviewer"]');
	if (viewerWindow) {
		viewerWindow.bringFront();
		viewerWindow.style.zIndex = '1000';
	}
}

// keyboard navigation
document.addEventListener('keydown', (e) => {
	const viewerWindow = document.querySelector('fos-window[name="imgviewer"]');
	if (viewerWindow && viewerWindow.style.display === 'block') {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			window.changeImage(-1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			window.changeImage(1);
		} else if (e.key === 'Escape') {
			viewerWindow.close();
		}
	}
});

async function initializeAlbum() {
	const imageCount = await detectImages();

	if (imageCount > 0) {
		console.log(`✅ Detected ${imageCount} images`);
		createThumbnails();
	} else {
		if (art3d) {
			art3d.innerHTML = '<div style="padding: 20px; text-align: center; font-family: MS Sans Serif;">No images found in 3d/ folder</div>';
		}
		console.log('❌ No images found');
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeAlbum);
} else {
	initializeAlbum();
}

/* --- CLOCK --- */
const time = () => {
	const date = new Date();
	const clockEl = $('#clock');
	if (clockEl) {
		clockEl.innerHTML = `${date.getHours().toString().pad(2)}:${date.getMinutes().toString().pad(2)}`;
	}
	setTimeout(time, 5000);
}

time();

/* --- AUDIO CONTROL FOR GAME IFRAMES --- */
const stopAllGameAudio = () => {
	const gameWindows = ['cmiyc', 'genius', 'invaderz', 'scramble'];
	gameWindows.forEach(gameName => {
		const gameWindow = document.querySelector(`fos-window[name="${gameName}"]`);
		if (gameWindow) {
			const iframe = gameWindow.querySelector('iframe');
			if (iframe) {
				const currentSrc = iframe.src;
				iframe.src = 'about:blank';
				iframe.dataset.originalSrc = currentSrc;
			}
		}
	});
};

const restoreGameIframe = (gameName) => {
	const gameWindow = document.querySelector(`fos-window[name="${gameName}"]`);
	if (gameWindow) {
		const iframe = gameWindow.querySelector('iframe');
		if (iframe && iframe.dataset.originalSrc) {
			iframe.src = iframe.dataset.originalSrc;
		}
	}
};

// Game audio management
document.addEventListener('DOMContentLoaded', () => {
	const gameIcons = ['cmiyc', 'genius', 'invaderz', 'scramble'];
	gameIcons.forEach(gameName => {
		const icon = document.querySelector(`fos-icon[href="${gameName}"]`);
		if (icon) {
			icon.addEventListener('dblclick', () => {
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

/* --- RADIO WINDOW AUDIO CONTROL --- */
document.addEventListener("DOMContentLoaded", () => {
	const radioWindow = document.querySelector('fos-window[name="radio"]');

	if (radioWindow) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "style") {
					if (radioWindow.style.display === "none") {
						const iframe = radioWindow.querySelector("iframe");
						if (iframe) {
							iframe.src = iframe.src;
							console.log("Radio window closed -> Music stopped.");
						}
					}
				}
			});
		});

		observer.observe(radioWindow, { attributes: true });
	}
});

/* --- an thanh cuon cho tung window --- */
function removeScrollbarForWindow(windowName) {
    const win = document.querySelector(`fos-window[name="${windowName}"]`);
    if (!win) return;
    const originalRender = win.render.bind(win);
    win.render = function() {
        originalRender();
        if (this.shadowRoot) {
            const style = document.createElement('style');
            style.textContent = `
                #content::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
                #content {
                    scrollbar-width: none !important;   /* Firefox */
                    -ms-overflow-style: none !important; /* IE/Edge */
                    overflow: hidden !important;
                }
            `;
            this.shadowRoot.appendChild(style);
        }
    };

    win.render();
}

document.addEventListener('DOMContentLoaded', () => {
    removeScrollbarForWindow('radio'); 
});

/* ---can giua window --- */
function centerWindowOnLoad(windowName, width, height) {
    if (window.innerWidth <= 768) return; 

    const win = document.querySelector(`fos-window[name="${windowName}"]`);
    if (win) {
        let newTop = (window.innerHeight - height) / 2;
        let newLeft = (window.innerWidth - width) / 2;

        if (newTop < 50) newTop = 50;
        if (newLeft < 0) newLeft = 0;

        win.top = newTop;
        win.left = newLeft;

        win.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        centerWindowOnLoad('art3d', 550, 450);
    }, 100); // delay 0.1s de dam bao thu vien load xong
    
    // centerWindowOnLoad('games', 400, 350); 
});