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