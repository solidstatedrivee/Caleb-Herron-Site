$(function() {
    $(".landing-nav").delay(1000).animate({ //lines 2-34 | fade in elements within landing section on page load
        opacity: "100%",
        top: "0"
    }, 1000);

    $(".landing-nav-divider").delay(1500).animate({
        width: "95%"
    }, 1000);

    $(".music-description").delay(1255).animate({
        opacity: "100%"
    }, 1000)

    $(".greeting").animate({
        opacity: "100%",
        top: "50%"
    }, 1000);

    $(".mobile-nav").delay(1000).animate({
        opacity: "100%"
    }, 1000);

    $(".top-bar").delay(1085).animate({
        width: "75%"
    }, 1000);

    $(".middle-bar").delay(1170).animate({
        width: "60%"
    }, 1000);

    $(".bottom-bar").delay(1255).animate({
        width: "45%"
    }, 1000);

    //lines 37-63 | animate and execute mobile navigation menu icon and content
    let getMobileNav = document.getElementsByClassName("mobile-nav");
    let getMobileNavBackground = document.getElementsByClassName("mobile-nav-background")[0];
    for (let i = 0; i < getMobileNav.length; i++) {
        getMobileNav[i].onclick = function() {
            if (this.classList.contains("close-button")) { //if the mobile hamburger menu is a close icon then remove the mobile navigation when clicked
                this.classList.remove("close-button");
                $("html").removeClass("no-scroll");
                $("body").removeClass("no-scroll");
                $(".mobile-nav-content").animate({
                    height: "0"
                }, 500);
                $(".mobile-nav-background").animate({
                    opacity: "0"
                }, 500);
                setTimeout(() => {
                    getMobileNavBackground.classList.remove("visible");
                }, 500);
                return
            }
            getMobileNav[i].classList.add("close-button"); //if hamburger menu is not a close icon, then open the mobile nav when clicked
            $("html").addClass("no-scroll");
            $("body").addClass("no-scroll");
            $(".mobile-nav-content").animate({
                height: "50%"
            }, 500);
            $(".mobile-nav-background").animate({
                opacity: "100%"
            }, 500);
            getMobileNavBackground.classList.add("visible");
        }
    }
    $(".mobile-nav-link").click(function() {
        getMobileNavBackground.classList.remove("visible");
        getMobileNav[0].classList.remove("close-button");
        $("html").removeClass("no-scroll");
        $("body").removeClass("no-scroll");
    })

    let ioItems = document.querySelectorAll(".io-item"); //all elements that will be tracked by IntersectionObserver

    let options = { //config for IntersectionObserver object
        root: null, //sets the viewport as the viewport
        rootMargin: "-1px 0px", //set a visibility margin of -1px to top and bottom of an element. if an element is flush with the viewport it wont be considered visible
        threshold: .5 //fire callback when more than half of the element is visile
    }

    let observer = new IntersectionObserver(function(entries, observer) { //API that allows you to track visibility of elements in viewport. first argument is a callback function
        entries.forEach(entry => {
            if (!entry.isIntersecting) { //if an element isnt in the viewport, don't load it
                return;
            } else if (entry.isIntersecting) { //once more than half of element is visible, fade it into the screen
                $(entry.target).animate({
                    opacity: "100%"
                }, 1000);
                observer.unobserve(entry.target); //once an individual target is observed, kill the observation as we no longer need to look at it
            };
        });
    }, options); //second argument is configuration options in the form of an object

    ioItems.forEach(item => { //IO cant be used on a NodeList so it must be called on individual items on that list
        observer.observe(item); //call IO on item using constructor
    })

    window.onscroll = function() {
        glueNav();
    }

    let bioNav = document.getElementsByClassName("bio-nav")[0];
    let sticky = bioNav.offsetTop;

    function glueNav() {
        if (window.pageYOffset >= sticky) { //if top of viewport goes past bioNav element, make bioNav position fixed to the top of the viewport
            bioNav.classList.add("sticky");
        } else {
            bioNav.classList.remove("sticky");
        }
    }

    // Controls the functionality of the audio player
    //-----------------------------------------------------------

    let playback = document.getElementsByClassName("playback");
    let mqAudio = document.getElementsByClassName("mq-audio");
    let seekbar = document.getElementsByClassName("seekbar");
    let seekbarFill = document.getElementsByClassName("seekbar-fill");
    let playTitleContainer = document.getElementsByClassName("play-title-container");
    let mqAudioUI = document.getElementsByClassName("mq-audio-ui");
    let mouseDown = false;

    let mapt = function(min, val, max) { //Clamp the values of clickPercentage() between 0 and 1 to avoid negative values. The handle does fall slightly outside the seekbar
        return Math.min(Math.max(min, val), max);
    }

    for (let i = 0; i < seekbar.length; i++) {
        seekbar[i].addEventListener("mouseup", function(e) { //When mouse click is released update the seekbar fill and the current time of the audio
            if (!mouseDown) {
                return
            }
            mouseDown = false;
            let clickPercentage = getClickPercentage(e, i);
            seekbarFill[i].style.width = clickPercentage * 100 + "%";
            mqAudio[i].currentTime = clickPercentage * mqAudio[i].duration;
        })
    }

    let getClickPercentage = function(e, index) { // Returns a value between 0 and 1 based on where the seekbar is click. i.e if clicked in the middle; return .5, if clicked 3/4 to the end ; return .75, etc.
        // this is used to turn into a percentage that will determine location of seekbar fill, handle, and audio time
        let clickPercentage = (e.clientX - (mqAudioUI[index].offsetLeft + playTitleContainer[index].offsetLeft)) / seekbar[index].clientWidth;
        clickPercentage = mapt(0, clickPercentage, 1);
        return clickPercentage;
    }

    for (let i = 0; i < seekbar.length; i++) {
        seekbar[i].addEventListener("mousedown", function(e) { //When mouse is clicked on seekbar update the fill based on the click location
            mouseDown = true;

            let clickPercentage = getClickPercentage(e, i);

            seekbarFill[i].style.width = clickPercentage * 100 + "%";
            // console.log(clickPercentage);
        })
    }

    for (let i = 0; i < seekbar.length; i++) {
        seekbar[i].addEventListener("mousemove", function(e) { //Enables dragging on seekbar
            if (!mouseDown) {
                return
            }
            let clickPercentage = getClickPercentage(e, i);
            seekbarFill[i].style.width = clickPercentage * 100 + "%";
        })
    }


    for (let i = 0; i < mqAudio.length; i++) {
        mqAudio[i].addEventListener("timeupdate", function() { //Updates the seekbar fill percentage based on the current time of the audio relative to its entire duration
            if (mouseDown) {
                return
            }
            let percentFilled = mqAudio[i].currentTime / mqAudio[i].duration;
            seekbarFill[i].style.width = percentFilled * 100 + "%";
        })
    }



    for (let i = 0; i < playback.length; i++) { // init functionality when playback button is clicked
        playback[i].onclick = function() {
            togglePlay(i);
            pauseOtherAudioMQ(document.body);
        }
    }


    let togglePlay = function(index) { //toggle playback on custom player and relative icons
        if (mqAudio[index].paused === false) {
            mqAudio[index].pause();
            playback[index].classList.remove("fa-pause");
            playback[index].classList.add("fa-play");
        } else {
            mqAudio[index].play();
            playback[index].classList.remove("fa-play");
            playback[index].classList.add("fa-pause");
        }
    }

    function pauseOtherAudio(container) { //prevents more than one audio file from being played simultaneously
        container.addEventListener("play", function(event) {
            audioElements = container.getElementsByTagName("audio")
            for (let i = 0; i < audioElements.length; i++) {
                audioElement = audioElements[i];
                if (audioElement !== event.target) { //if audio playing is not the selected target then pause it and all other audio except for the selected target
                    audioElement.pause();
                }
            }
        }, true);
    }

    function pauseOtherAudioMQ(container) { //works the same as pauseOtherAudio() but is applied to custom player
        container.addEventListener("play", function(event) {
            audioElements = container.getElementsByTagName("audio")
            for (let i = 0; i < audioElements.length; i++) {
                audioElement = audioElements[i];
                if (audioElement !== event.target) {
                    audioElement.pause();
                    playback[i].classList.remove("fa-pause");
                    playback[i].classList.add("fa-play");
                }
            }
        }, true);
    }

    pauseOtherAudio(document.body);
    // End audio player functionality
    //-----------------------------------------------------------------

    // Send info in contact form to host server so that it can be sent to recipient email server
    // -------------------------------------------------------------------------
    $('form').on('submit', (e) => {
        e.preventDefault();

        const subject = $('#subject').val().trim();
        const email = $('#email').val().trim();
        const text = $('#text').val().trim();

        const data = {
            subject,
            email,
            text
        }

        $.post('/email', data).then(() => {
            // console.log('Server has received client data');
            $('.sent-success').css('display', 'block');
        }).catch(() => {
            // console.log('Server did not receive client data');
            $('.sent-error').css('display', 'block');
        });
    });
    // ------------------------------------------------------------------------------------

    $(".close-sent-modal").on("click", () => { //close email response modal
        $(".send-clicked").css("display", "none");
    })


    // Enable the use of native web share in supported browsers
    //--------------------------------------------------------------------------------------------------------
    let webShare = document.getElementsByClassName("web-share");
    for (let i = 0; i < webShare.length; i++) {
        webShare[i].addEventListener("click", (e) => {
            e.preventDefault();
            if (i == 0) {
                if (navigator.share) {
                    navigator.share({
                        title: 'Dolor Sit Amet',
                        url: 'https://chambercartel.bandcamp.com/'
                    }).then(() => {
                        alert("Thank you for sharing!") //turn this into a modal
                    }).catch(
                        alert("This browser doesn't support web share")
                    );
                } else {
                    alert("Sorry, this browser doesn't support web share."); //turn this into a modal
                }
            } else if (i == 1) {
                if (navigator.share) {
                    navigator.share({
                        title: 'Consectetur Adipisicing',
                        url: 'https://chambercartel.bandcamp.com/'
                    }).then(() => {
                        alert("Thank you for sharing!") //turn this into a modal
                    }).catch(
                        alert("This browser doesn't support web share")
                    );
                } else {
                    alert("Sorry, this browser doesn't support web share."); //turn this into a modal
                }
            } else {
                if (navigator.share) {
                    navigator.share({
                        title: 'Hic Quos',
                        url: 'https://chambercartel.bandcamp.com/'
                    }).then(() => {
                        alert("Thank you for sharing!") //turn this into a modal
                    }).catch(
                        alert("This browser doesn't support web share")
                    );
                } else {
                    alert("Sorry, this browser doesn't support web share."); //turn this into a modal
                }
            }
        })
    }
    //-----------------------------------------------------------------------------------------------------------------

});