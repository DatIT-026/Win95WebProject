const $ = s => document.querySelector(s);
const $c = t => document.createElement(t);

let loadedImages = [], currIdx = 0;
let albumLoaded = false;
const art3d = $('#art3dicons');
const customFileNames = ["new-me.jpg", "comic.jpg"];

const imageExists = url => new Promise(r => {
    const i = new Image();
    i.onload = () => r(true);
    i.onerror = () => r(false);
    i.src = url;
});

const detectImages = async () => {
    if (art3d) art3d.innerHTML = '<div style="padding:20px;text-align:center;color:#808080;">Loading...</div>';
    let numeric = [];
    for (let s = 1; s <= 5; s += 10) {
        const res = await Promise.all(Array.from({ length: Math.min(10, 5 - s + 1) }, (_, i) => {
            const n = (s + i).toString(), p = `3d/${n}.jpg`;
            return imageExists(p).then(e => e ? { path: p, name: `${n}.jpg` } : null);
        }));
        numeric = [...numeric, ...res.filter(Boolean)];
        if (!res.filter(Boolean).length && numeric.length > 5) break;
    }
    const custom = (await Promise.all(customFileNames.map(n => {
        const p = `3d/${n}`;
        return imageExists(p).then(e => e ? { path: p, name: n } : null);
    }))).filter(Boolean);
    
    loadedImages = [...numeric, ...custom];
    if (art3d) art3d.innerHTML = '';
    return loadedImages.length;
};

const createThumbnails = () => {
    if (!art3d) return;
    loadedImages.forEach((d, i) => {
        const ic = $c('fos-icon');
        ic.setAttribute('tabindex', '0');
        const img = new Image();
        img.loading = "lazy";
        img.src = d.path;
        ic.appendChild(img);
        art3d.appendChild(ic);
        const open = () => openViewer(i);
        ic.onclick = open;
    });
    const sb = $('.folder-statusbar');
    if (sb) { sb.style.display = 'block'; sb.textContent = `${loadedImages.length} object(s)`; }
};

const loadAlbumLogic = async () => {
    if (albumLoaded) return;
    albumLoaded = true;
    if (await detectImages() > 0) createThumbnails();
    else if (art3d) art3d.innerHTML = '<div>No images</div>';
};

const TemplateManager = {
    apps: ['browser', 'radio', 'thispc', 'aboutme', 'games'],
    
    init: () => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.attributeName === 'style' && m.target.tagName === 'FOS-WINDOW') {
                    TemplateManager.checkWindow(m.target);
                }
            });
        });
        
        observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style'] });
    },

    checkWindow: (win) => {
        const name = win.getAttribute('name');
        
        if (name === 'art3d' && win.style.display !== 'none') {
            loadAlbumLogic();
            return;
        }

        if (TemplateManager.apps.includes(name)) {
            const wrapper = win.querySelector(`#wrapper-${name}`);
            if (!wrapper) return;

            const isVisible = win.style.display !== 'none';
            const hasContent = wrapper.hasChildNodes();

            if (isVisible && !hasContent) {
                const tpl = document.getElementById(`tpl-${name}`);
                if (tpl) {
                    wrapper.appendChild(tpl.content.cloneNode(true));
                    
                    if (name === 'browser' && win.dataset.lastUrl) {
                        const iframe = wrapper.querySelector('iframe');
                        if (iframe) iframe.src = win.dataset.lastUrl;
                    }
                }
            } else if (!isVisible && hasContent) {
                if (name === 'browser') {
                    const iframe = wrapper.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                        try { win.dataset.lastUrl = iframe.contentWindow.location.href; } catch(e) {}
                    }
                }

                wrapper.innerHTML = '';
            }
        }
    }
};

const updateViewer = () => {
    const img = loadedImages[currIdx];
    if (!img) return;
    const el = $('#main-display-img');
    if (el) el.src = img.path;
    const cnt = $('#img-counter');
    if (cnt) cnt.textContent = `${currIdx + 1}/${loadedImages.length}`;
    const win = $('fos-window[name="imgviewer"]');
    if (win) {
        win.setAttribute('title', img.name);
        const t = win.shadowRoot?.querySelector('#winTitle');
        if (t) t.textContent = img.name;
    }
};

const openViewer = idx => {
    currIdx = idx;
    updateViewer();
    $('fos-window[name="imgviewer"]').style.display = 'block';
    $('fos-window[name="imgviewer"]').bringFront();
};

window.changeImage = d => {
    currIdx = (currIdx + d + loadedImages.length) % loadedImages.length;
    updateViewer();
};

const clock = () => {
    const d = new Date(), el = $('#clock');
    if (el) el.innerHTML = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const tweakWindow = (name, w, h) => {
    const win = $(`fos-window[name="${name}"]`);
    if (!win) return;
    
    const oldRender = win.render.bind(win);
    win.render = function() {
        oldRender();
        if (this.shadowRoot) {
            const s = $c('style');
            s.textContent = '#content::-webkit-scrollbar{display:none}#content{overflow:hidden!important}';
            this.shadowRoot.appendChild(s);
        }
    };
    win.render();

    if (w && h) {
        win.top = Math.max(50, (window.innerHeight - h) / 2);
        win.left = Math.max(0, (window.innerWidth - w) / 2);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    clock();
    setInterval(clock, 5000);
    
    TemplateManager.init();

    tweakWindow('radio');
    tweakWindow('art3d');
    
    setTimeout(() => {
        tweakWindow('art3d', 900, 500);
        tweakWindow('imgviewer', 200, 450);
    }, 100);
});