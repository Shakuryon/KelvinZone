document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('navbarCont');
    const sectNav = document.getElementById('navbarSection')
    const scrollThres = 30; // N of pixels before transformin'

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThres) {
            mainNav.classList.add('scrolled');
            sectNav.classList.add('scrolledtoo')
            
        }

        else {
            mainNav.classList.remove('scrolled');
            sectNav.classList.remove('scrolledtoo')
        }
    })

    const title = document.title;
    let i = 0;

    function typeTitle() {
        document.title = title.slice(0, i++);
        if (i <= title.length) {
            setTimeout(typeTitle, 95);
        }
    }

    typeTitle();
})

const reviewSlides = Array.from(document.querySelectorAll(".review-slide"));
    const reviewDots = Array.from(document.querySelectorAll(".review-dot"));
    const reviewPrev = document.querySelector(".review-prev");
    const reviewNext = document.querySelector(".review-next");
    const reviewIndexDisplay = document.querySelector(".review-index");
    let reviewIndex = 0;

    function showReview(index) {
        if (!reviewSlides.length) return;
        reviewIndex = (index + reviewSlides.length) % reviewSlides.length;

        reviewSlides.forEach((slide, i) => {
            const active = i === reviewIndex;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", String(!active));
        });

        reviewDots.forEach((dot, i) => {
            const active = i === reviewIndex;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-pressed", String(active));
        });
    }

    function showReview(index) {
        if (!reviewSlides.length) return;

        reviewIndex = (index + reviewSlides.length) % reviewSlides.length;

        // Update the current slide index (e.g. 01 / 03).
        if (reviewIndexDisplay) {
            reviewIndexDisplay.innerHTML = `
                ${String(reviewIndex + 1).padStart(2, "0")} /
                ${String(reviewSlides.length).padStart(2, "0")}
            `;
        }

        reviewSlides.forEach((slide, i) => {
            const active = i === reviewIndex;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", String(!active));
        });

        reviewDots.forEach((dot, i) => {
            const active = i === reviewIndex;
            dot.classList.toggle("is-active", active);
            dot.setAttribute("aria-pressed", String(active));
        });
    }

    reviewPrev?.addEventListener("click", () => showReview(reviewIndex - 1));
    reviewNext?.addEventListener("click", () => showReview(reviewIndex + 1));
    reviewDots.forEach((dot, i) => dot.addEventListener("click", () => showReview(i)));
    showReview(0);

    // Keep the footer year current.
    const currentYear = document.getElementById("currentYear");
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // The policy anchors are placeholders, not legal policy documents.
    document.querySelectorAll("[data-policy-link]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const policyName = link.dataset.policyLink === "terms" ? "Terms & Conditions" : "Privacy Policy";
            alert(`${policyName} is a placeholder in this website demo. We'll add the actual policy if published!`);
        });
    });
/* =========================================
   HERO VOICE REEL PLAYERS
========================================= */

document.querySelectorAll("[data-audio-player]").forEach((player) => {
    const audio = player.querySelector(".voice-reel-audio");
    const playButton = player.querySelector("[data-play]");
    const progress = player.querySelector("[data-progress]");
    const currentTimeLabel = player.querySelector("[data-current-time]");
    const durationLabel = player.querySelector("[data-duration]");
    const statusLabel = player.querySelector("[data-status]");

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) {
            return "--:--";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    function updateProgress() {
        currentTimeLabel.textContent = formatTime(audio.currentTime);

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            progress.value = (audio.currentTime / audio.duration) * 100;
        } else {
            progress.value = 0;
        }
    }

    function updateDuration() {
        durationLabel.textContent = formatTime(audio.duration);
        updateProgress();
    }

    function setPlayingState(isPlaying) {
        player.classList.toggle("is-playing", isPlaying);
        playButton.setAttribute("aria-pressed", String(isPlaying));

        playButton.setAttribute(
            "aria-label",
            `${isPlaying ? "Pause" : "Play"} ${player.querySelector(".voice-reel-title").textContent}`
        );

        statusLabel.textContent = isPlaying ? "NOW PLAYING" : "READY TO PLAY";
    }

    playButton.addEventListener("click", async () => {
        if (audio.paused) {
            // Stop the other reel before starting this one.
            document.querySelectorAll("[data-audio-player]").forEach((otherPlayer) => {
                if (otherPlayer === player) return;

                const otherAudio = otherPlayer.querySelector(".voice-reel-audio");
                otherAudio.pause();
            });

            statusLabel.textContent = "LOADING AUDIO...";

            try {
                await audio.play();
            } catch (error) {
                statusLabel.textContent = "UNABLE TO PLAY AUDIO";
                console.error("Voice reel playback failed:", error);
            }
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("play", () => {
        setPlayingState(true);
    });

    audio.addEventListener("pause", () => {
        setPlayingState(false);
    });

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("timeupdate", updateProgress);

    audio.addEventListener("ended", () => {
        player.classList.remove("is-playing");
        playButton.setAttribute("aria-pressed", "false");
        playButton.setAttribute(
            "aria-label",
            `Play ${player.querySelector(".voice-reel-title").textContent}`
        );

        progress.value = 0;
        currentTimeLabel.textContent = "0:00";
        statusLabel.textContent = "PLAYBACK COMPLETE";
    });

    audio.addEventListener("error", () => {
        player.classList.remove("is-playing");
        statusLabel.textContent = "AUDIO FILE UNAVAILABLE";
    });

    progress.addEventListener("input", () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = (Number(progress.value) / 100) * audio.duration;
            updateProgress();
        }
    });

    audio.addEventListener("loadstart", () => {
        statusLabel.textContent = "LOADING AUDIO...";
    });

    audio.addEventListener("canplay", () => {
        if (audio.paused) {
            statusLabel.textContent = "READY TO PLAY";
        }
    });
});


const characterAudio = document.getElementById("characterAudio");
const characterCards = document.querySelectorAll(".char-card");

if (characterAudio && characterCards.length) {
    let activeCard = null;

    function resetCharacterCard(card) {
        if (!card) return;

        card.classList.remove("is-playing");
        card.setAttribute("aria-pressed", "false");
    }

    function stopCharacterAudio() {
        characterAudio.pause();
        characterAudio.currentTime = 0;

        resetCharacterCard(activeCard);
        activeCard = null;
    }

    characterCards.forEach((card) => {
        card.addEventListener("click", async () => {
            const audioPath = card.dataset.characterAudio;

            if (!audioPath) return;

            // Clicking the currently playing character pauses it.
            if (activeCard === card && !characterAudio.paused) {
                characterAudio.pause();
                return;
            }

            // Clicking the paused active character resumes it.
            if (
                activeCard === card &&
                characterAudio.paused &&
                characterAudio.currentTime > 0
            ) {
                try {
                    await characterAudio.play();
                } catch (error) {
                    console.error("Unable to resume character audio:", error);
                }
                return;
            }

            // Stop the previous character before loading the next.
            stopCharacterAudio();

            activeCard = card;
            characterAudio.src = audioPath;
            characterAudio.load();

            try {
                await characterAudio.play();
            } catch (error) {
                resetCharacterCard(card);
                activeCard = null;
                console.error("Unable to play character audio:", error);
            }
        });
    });

    characterAudio.addEventListener("play", () => {
        if (!activeCard) return;

        activeCard.classList.add("is-playing");
        activeCard.setAttribute("aria-pressed", "true");
    });

    characterAudio.addEventListener("pause", () => {
        resetCharacterCard(activeCard);
    });

    characterAudio.addEventListener("ended", () => {
        resetCharacterCard(activeCard);
        activeCard = null;
        characterAudio.currentTime = 0;
    });

    characterAudio.addEventListener("error", () => {
        if (!activeCard) return;

        console.error(
            "Character audio could not be loaded:",
            characterAudio.currentSrc
        );

        resetCharacterCard(activeCard);
        activeCard = null;
    });
}
