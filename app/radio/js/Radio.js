class Radio {

	constructor(){
		this.player = new Audio();
		this.playlist = [
      {name: 'Tổng Hợp Nhạc của anh Jack', slug: 'J97', src: '././radio-file/J97-Songs.mp3'},
	  {name: 'Tổng Hợp Nhạc của anh Jack', slug: 'J97', src: '././radio-file/J97-Songs.mp3'},
	  {name: 'Tổng Hợp Nhạc của anh Jack', slug: 'J97', src: '././radio-file/J97-Songs.mp3'},

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