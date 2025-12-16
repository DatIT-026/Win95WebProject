const $ = s => document.querySelector(s);
const $c = t => document.createElement(t);

let loadedImages = [], currIdx = 0;
const art3d = $('#art3dicons');
const customFileNames = ["new-me.jpg", "comic.jpg"];

const imageExists = url => new Promise(r => {
    const i = new Image();
    i.onload = () => r(true);
    i.onerror = () => r(false);
    i.src = url;
});

const detectImages = async () => {
    if (art3d) art3d.innerHTML = '<div style="padding:20px;text-align:center;font-family:MS Sans Serif;color:#808080;">Loading images...</div>';
    
    let numeric = [];
    for (let s = 1; s <= 11; s += 10) {
        const res = await Promise.all(
            Array.from({ length: Math.min(10, 11 - s + 1) }, (_, i) => {
                const n = (s + i).toString(), p = `3d/${n}.jpg`;
                return imageExists(p).then(e => e ? { path: p, name: `${n}.jpg` } : null);
            })
        );
        const valid = res.filter(Boolean);
        numeric = [...numeric, ...valid];
        if (!valid.length && numeric.length > 5) break;
    }

    const custom = (await Promise.all(customFileNames.map(n => {
        const p = `3d/${n}`;
        return imageExists(p).then(e => e ? { path: p, name: n } : null);
    }))).filter(Boolean);

    loadedImages = [...numeric, ...custom];
    if (art3d) art3d.innerHTML = '';
    return loadedImages.length;
};

const updateViewer = () => {
    currIdx = (currIdx + loadedImages.length) % loadedImages.length;
    const img = loadedImages[currIdx];
    if (!img) return;

    const el = $('#main-display-img');
    if (el) {
        el.src = img.path;
        el.alt = img.name;
        el.onerror = () => { el.alt = 'Image not found'; el.style.backgroundColor = '#ccc'; };
    }
    
    const cnt = $('#img-counter');
    if (cnt) cnt.textContent = `${currIdx + 1}/${loadedImages.length}`;

    const win = $('fos-window[name="imgviewer"]');
    if (win) {
        win.setAttribute('title', `Image Viewer - ${img.name}`);
        const t = win.shadowRoot?.querySelector('#winTitle');
        if (t) t.textContent = `Image Viewer - ${img.name}`;
    }
};

const openViewer = idx => {
    currIdx = idx;
    updateViewer();
    const win = $('fos-window[name="imgviewer"]');
    if (win) {
        win.style.display = 'block';
        win.bringFront();
    }
};

const createThumbnails = () => {
    if (!art3d) return;
    loadedImages.forEach((d, i) => {
        const ic = $c('fos-icon');
        ic.setAttribute('tabindex', '0');
        const img = new Image();
        img.src = d.path;
        img.loading = "lazy";
        img.onerror = () => img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="#ccc" width="48" height="48"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666" font-family="Arial" font-size="10">No Image</text></svg>';
        
        ic.appendChild(img);
        art3d.appendChild(ic);
        
        const open = () => openViewer(i);
        ic.addEventListener('click', open);
        ic.addEventListener('dblclick', open);
        ic.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open()));
    });
    const sb = $('.folder-statusbar');
    if (sb) sb.textContent = `${loadedImages.length} object(s)`;
};

window.changeImage = d => {
    currIdx += d;
    updateViewer();
    const win = $('fos-window[name="imgviewer"]');
    if (win) win.bringFront();
};

document.addEventListener('keydown', e => {
    const win = $('fos-window[name="imgviewer"]');
    if (win?.style.display === 'block') {
        if (e.key === 'ArrowLeft') { e.preventDefault(); window.changeImage(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); window.changeImage(1); }
        else if (e.key === 'Escape') win.close();
    }
});

const clock = () => {
    const d = new Date(), el = $('#clock');
    if (el) el.innerHTML = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const manageAudio = () => {
    const games = ['cmiyc', 'genius', 'invaderz', 'scramble', 'santy', 'secret_santa', 'radio'];
    
    new MutationObserver(muts => muts.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'style') {
            const t = m.target;
            if (t.tagName === 'FOS-WINDOW' && games.includes(t.getAttribute('name'))) {
                const f = t.querySelector('iframe');
                if (!f) return;

                if (t.style.display === 'none') {
                    // Window Hidden: Save src and blank it to stop audio
                    if (!f.dataset.src) f.dataset.src = f.src;
                    if (f.src !== 'about:blank') f.src = 'about:blank';
                } else {
                    // Window Shown: Restore src if it was blanked
                    // Works for Start Menu, Icons, and Task switching
                    if (f.dataset.src && f.src === 'about:blank') {
                        f.src = f.dataset.src;
                    }
                }
            }
        }
    })).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] });
};

const tweakWindow = (name, w, h) => {
    const win = $(`fos-window[name="${name}"]`);
    if (!win) return;
    
    const r = win.render.bind(win);
    win.render = function() {
        r();
        if (this.shadowRoot) {
            const s = $c('style');
            s.textContent = '#content::-webkit-scrollbar{display:none}#content{scrollbar-width:none;-ms-overflow-style:none;overflow:hidden!important}';
            this.shadowRoot.appendChild(s);
        }
    };
    win.render();

    if (w && h && window.innerWidth > 768) {
        win.top = Math.max(50, (window.innerHeight - h) / 2);
        win.left = Math.max(0, (window.innerWidth - w) / 2);
        win.render();
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    clock();
    setInterval(clock, 5000);
    
    if (await detectImages() > 0) createThumbnails();
    else if (art3d) art3d.innerHTML = '<div style="padding:20px;text-align:center;font-family:MS Sans Serif;">No images found in 3d/ folder</div>';

    manageAudio();
    tweakWindow('radio');
    tweakWindow('art3d');
    
    setTimeout(() => {
        tweakWindow('art3d', 900, 500);
        tweakWindow('imgviewer', 200, 450);
    }, 100);
});