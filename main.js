function Player(container,title) {

	this.container=container;
	this.title=title;

	var audio = container.querySelector('.audio');
	var playlist = container.querySelector('.playlist');
	var currentSong = container.querySelector('.current-song');
	var volume = container.querySelector('.volume');
	var currentVolume = container.querySelector('.current-volume');
	var time = container.querySelector('.time');
	var timeProgress = container.querySelector('.controls>progress'); 
	
	var mover = false;
	var cursorPos;
	var timePos;

	//функция проставляет стартовые знчения плеера для первой песни загруженного списка песен
  (function startOptions(){

  	var selectFirstElement = playlist.firstElementChild.querySelector('a');

		audio.src="mp3s/" + selectFirstElement.dataset.file;
		currentVolume.innerHTML = audio.volume*100+"%";
		volume.value=audio.volume*100;
		title.innerHTML=selectFirstElement.innerHTML;

		audio.onloadedmetadata = function(){
			timeField();			
		}

  })()
  
  //события на кнопках (кроме событий изменения плеера прогрессбаров звука и времени песни)
  container.addEventListener('click',function(e) {
    //клики по песням из списка  
    if(e.target.tagName === 'A'){                           
      currentSong.innerHTML=e.target.innerHTML;
      title.innerHTML=e.target.innerHTML;
      audio.src="mp3s/"+e.target.dataset.file;         
      
      playback();
    }
    //кнопка включения/выключения проигрывания аудиозаписи
    if(e.target.className.indexOf("play")!==-1) {      
      playback();
    }
    //уменьшение громкости
    if(e.target.className.indexOf("volume-down")!==-1) {      
      if(audio.volume>0.001) {
        audio.volume=audio.volume-0.01;
      }
    }
    //увеличение громкости
    if(e.target.className.indexOf("volume-up")!==-1) {
      if(audio.volume<=0.99) {
        audio.volume=audio.volume+0.01;
      }
    }
    //промотка аудиозаписи вперед на 10 секунд
    if(e.target.className.indexOf("forward")!==-1) {
      audio.currentTime += 10;    
    } 
		//промотка аудиозаписи назад на 10 секунд
    if(e.target.className.indexOf("back")!==-1) {              
      audio.currentTime -= 10;
    }
    //переключение на предыдущую аудиозапись
    if(e.target.className.indexOf("prev")!==-1){ 

      for (var i = 0; i < playlist.children.length; i++) {
      
      var audioSrc=audio.src;
      var from=audioSrc.search('mp3s/'); 
      var to=audioSrc.length;
      var audioSrcClear = audioSrc.substring(from,to);

        if(audioSrcClear==="mp3s/"+ playlist.children[i].querySelector('a').dataset.file){
          
          if(i==0){  

            var playlistQuerySelector1 = playlist.children[playlist.children.length-1].querySelector('a');
            audio.src="mp3s/" + playlistQuerySelector1.dataset.file;
            currentSong.innerHTML=playlistQuerySelector1.innerHTML;
            title.innerHTML=playlistQuerySelector1.innerHTML;
            
            playback();

            break;
          }

          if(i>0){

            var playlistQuerySelector2 = document.querySelector('.playlist').children[i-1].querySelector('a');
            audio.src="mp3s/" + playlistQuerySelector2.dataset.file;
            currentSong.innerHTML=playlistQuerySelector2.innerHTML;
            title.innerHTML=playlistQuerySelector2.innerHTML;
            
            playback();

          }
        }     
      }
    }
		//переключение на следующую аудиозапись
    if(e.target.className.indexOf("next")!==-1){              
      
      for (var i = 0; i < playlist.children.length; i++) {
                
      var audioSrc=audio.src;
      var from=audioSrc.search('mp3s/'); 
      var to = audioSrc.length;
      var audioSrcClear = audioSrc.substring(from,to);

        if(audioSrcClear==="mp3s/"+document.querySelector('.playlist').children[i].querySelector('a').dataset.file){
          
          if(i===document.querySelector('.playlist').children.length-1){

            var playlistQuerySelector3 = playlist.children[0].querySelector('a');
            audio.src="mp3s/"+playlistQuerySelector3.dataset.file;
            currentSong.innerHTML=playlistQuerySelector3.innerHTML;
            title.innerHTML=playlistQuerySelector3.innerHTML;
            
            playback();

            break;
          }
        
          if(i<playlist.children.length-1){

            var playlistQuerySelector4 = document.querySelector('.playlist').children[i+1].querySelector('a');
            audio.src="mp3s/"+playlistQuerySelector4.dataset.file;
            currentSong.innerHTML=playlistQuerySelector4.innerHTML;
            title.innerHTML= playlistQuerySelector4.innerHTML;

            playback();

            break;
          }
        }     
      }
    }
  })
  //отображение изменения громкости в числовом виде и на прогрессбаре 
  audio.addEventListener('volumechange', function(e) {    
		currentVolume.innerHTML=Math.round(audio.volume*100)+"%";
		volume.value=e.target.volume*100;  
  })
  //отображение изменения времени в числовом виде и на прогрессбаре 
  audio.addEventListener('timeupdate',function(e){    
		timeField();    
    timeProgress.max=e.target.duration;
    timeProgress.value=e.target.currentTime;	
  })
  //события нажатия на прогрессбаре громкости
  volume.addEventListener('mousedown', function(e) {
	  mover = true; 
		progressVolumePos(e);
  })

  volume.addEventListener('mousemove', function(e) {
  	if(mover) {
			progressVolumePos(e);
  	}  
  })

  volume.addEventListener('mouseup', function(e) {  
  	mover = false;  
  })
	//события нажатия на прогрессбаре времени проигрывания
  timeProgress.addEventListener('mousedown', function(e) {	  
	  mover = true;  
		progressTimePos(e)  
  })
  
	timeProgress.addEventListener('mousemove', function(e) {	 
	  if(mover) {
			progressTimePos(e)
  	}
  })

  timeProgress.addEventListener('mouseup', function(e) {	  
	  mover = false;  		
  })
  //расчет позиции линии в прогрессбаре для времени проигрывания
  function progressTimePos(e) {
  	cursorPos=(e.pageX-timeProgress.getBoundingClientRect().left)/timeProgress.offsetWidth;
		timePos=audio.duration*cursorPos;
		audio.currentTime = timePos;		
  }
  //расчет позиции линии в прогрессбаре для громкости
  function progressVolumePos(e) {
  	cursorPos=(e.pageX-volume.getBoundingClientRect().left)/volume.offsetWidth;
		audio.volume = cursorPos;
  }
  //функция вычисления времени проигрывания для числового отображения
  function timeField() {    
		var durationSec = Math.round(audio.duration%60);
		if (durationSec < 10) durationSec = "0" + durationSec;
		var durationMinutes = Math.round((audio.duration-audio.duration%60)/60); 

		var currentMinutes = Math.round((timeProgress.value-timeProgress.value%60)/60);
		var currentSec = Math.round(timeProgress.value%60);
		if (currentSec < 10) currentSec = "0" + currentSec;
			
		time.innerHTML=currentMinutes + ":" + currentSec +
		" из "+durationMinutes + ":" + durationSec;
	}
	//функция запуска и остановки проигрывателя
  function playback() {
  	if(audio.paused) {
      audio.play();
      localStorage.setItem('playEvent', new Date().getTime());
    }else {
      audio.pause();		
    }
  }
  //функция прослушивания событий между вкладками
	window.addEventListener("storage", function(event) {		
		if(event.key==='playEvent') {
			audio.pause();
		}
	}, false);

}

var container = document.querySelector('.player-container');
var title = document.querySelector('title');

Player(container,title);

