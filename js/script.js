// Floating hearts
setInterval(()=>{
    let heart=document.createElement("div");
    heart.className="heart";
    heart.innerHTML="❤️";
    heart.style.left=Math.random()*100+"vw";
    heart.style.fontSize=Math.random()*20+15+"px";
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),6000);
},500);

// Background music (shared across all pages)
let bgMusicInstance = null;
let bgMusicListenerAttached = false;

function getBgMusic(){
    if(bgMusicInstance){
        return bgMusicInstance;
    }

    // Try existing audio element first (index page)
    let existing = document.getElementById("bgMusic");
    if(existing){
        bgMusicInstance = existing;
    }else{
        // Fallback: create a hidden audio element (for other pages)
        const audio = document.createElement("audio");
        audio.id = "bgMusic";
        audio.src = "music/love.mp3";
        audio.loop = true;
        audio.style.display = "none";
        document.body.appendChild(audio);
        bgMusicInstance = audio;
    }

    // Attach time tracking once so we can resume from the same spot
    if(bgMusicInstance && !bgMusicListenerAttached && window.sessionStorage){
        bgMusicInstance.addEventListener("timeupdate",()=>{
            try{
                sessionStorage.setItem("bgMusicTime",String(bgMusicInstance.currentTime || 0));
            }catch(e){}
        });
        bgMusicListenerAttached = true;
    }

    return bgMusicInstance;
}

// Music toggle (also saves state so it persists across pages)
function toggleMusic(){
    const music = getBgMusic();
    if(!music) return;

    if(music.paused){
        music.play();
        if(window.sessionStorage){
            sessionStorage.setItem("bgMusicPlaying","true");
        }
    }else{
        music.pause();
        if(window.sessionStorage){
            sessionStorage.setItem("bgMusicPlaying","false");
        }
    }
}

// Image popup
function showImage(src){
    document.getElementById("popupImg").src=src;
    document.getElementById("popup").style.display="flex";
}

function closePopup(){
    document.getElementById("popup").style.display="none";
}

// Typewriter effect
function typeWriter(){
    let text="Dearest Love, Every moment with you feels magical. You are my forever.";
    let i=0;
    let speed=50;
    function typing(){
        if(i<text.length){
            document.getElementById("letterText").innerHTML+=text.charAt(i);
            i++;
            setTimeout(typing,speed);
        }
    }
    typing();
}

window.onload=()=>{
    // Start typewriter on letter page
    if(document.getElementById("letterText")){
        typeWriter();
    }

    // Restore music state across pages (position + playing state)
    if(window.sessionStorage){
        const music = getBgMusic();
        if(music){
            const lastTime = parseFloat(sessionStorage.getItem("bgMusicTime") || "0");
            if(!isNaN(lastTime) && lastTime > 0){
                music.currentTime = lastTime;
            }

            if(sessionStorage.getItem("bgMusicPlaying")==="true" && music.paused){
                const playPromise = music.play();
                if(playPromise && playPromise.catch){
                    playPromise.catch(()=>{});
                }
            }
        }
    }
}
