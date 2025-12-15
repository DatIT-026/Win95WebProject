class Radio {

	constructor(){
		this.player = new Audio();
		this.playlist = [
      {name: 'Lemon Tree - Fool❜s Garden', slug: 'LemonTree', src: '././radio-file/Lemon-Tree.mp3'},
      {name: 'Feliz Navidad', slug: 'Feliz_Navidad', src: '././radio-file/Feliz_Navidad.mp3'},
	  {name: 'Jingle Bells', slug: 'JB', src: '././radio-file/Jingle_Bells.mp3'},
	  {name: 'All I Want For Christmas Is You', slug: 'AIWFCIY', src: '././radio-file/All_I_Want_For_Christmas_Is_You.mp3'},
	  {name: 'We Wish You a Merry Christmas', slug: 'WWYaMC', src: '././radio-file/We_Wish_You_a_Merry_Christmas.mp3'},
	  {name: 'Last Christmas', slug: 'LastChristmas', src: '././radio-file/Last_Christmas.mp3'}
		];
		this.player.src = this.playlist[0].src;
		this.player.preload = 'auto';
		this.player.crossOrigin = 'anonymous';
		this.canPlay = false;
	}
	
	init(){
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 1024;
		this.bufferLength = this.analyser.frequencyBinCount;
		this.data = new Uint8Array(this.bufferLength);
		this.analyser.getByteTimeDomainData(this.data);
		this.source = this.audioContext.createMediaElementSource( this.player );
		this.source.connect( this.analyser );
		this.source.connect( this.audioContext.destination );
	}
	
	togglePlay(){
		if(!this.canPlay){
			this.init();
			this.canPlay = true;
		}
		if( this.player.paused ){
			this.audioContext.resume();
			this.player.play();
		}else{
			this.player.pause();
		}
	}
	
	update(){
		this.bufferLength = this.analyser.frequencyBinCount;
		this.data = new Uint8Array(this.bufferLength);
		this.analyser.getByteTimeDomainData(this.data);
	}

}