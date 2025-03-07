const formats = {
    test: { bat: 8, pace: 3, spin: 2, totalBowlers: 5 },
    odi: { bat: 7, pace: 4, spin: 2, totalBowlers: 6 },
    t20: { bat: 8, pace: 3, spin: 2, totalBowlers: 5 }
};

let currentFormat = 'test';

// Preloader Typing Effect
function typeText(text, elementId, delay = 100) {
    let index = 0;
    function type() {
        if (index < text.length) {
            document.getElementById(elementId).innerHTML += text.charAt(index);
            index++;
            setTimeout(type, delay);
        } else {
            setTimeout(() => {
                document.getElementById("preloader").style.display = "none";
                document.getElementById("main-content").style.display = "block";
                setFormat(currentFormat);
            }, 1000);
        }
    }
    type();
}

window.onload = function() {
    typeText("Hi, welcome to the all-time best India's team selection!", "preloader-text");
};

// Set format values
function setFormat(format) {
    currentFormat = format;
    document.getElementById("batters").value = formats[format].bat;
    document.getElementById("pacers").value = formats[format].pace;
    document.getElementById("spinners").value = formats[format].spin;

    document.querySelectorAll('.format-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.format-btn:nth-child(${format === 'test' ? 1 : format === 'odi' ? 2 : 3})`).classList.add('active');
}

// Auto-adjust pacers & spinners
function updateBowlers(changed) {
    let totalBowlers = formats[currentFormat].totalBowlers;
    let pace = parseInt(document.getElementById("pacers").value);
    let spin = parseInt(document.getElementById("spinners").value);

    if (changed === "pace") {
        document.getElementById("spinners").value = totalBowlers - pace;
    } else {
        document.getElementById("pacers").value = totalBowlers - spin;
    }
}

// Fetch Team with Loading State & Animated Reveal
async function fetchTeam() {
    let teamList = document.getElementById("team-list");
    teamList.innerHTML = "<li>Loading team...</li>";

    const response = await fetch(`https://cricketapi-hs0m.onrender.com/${currentFormat}_team`);
    const data = await response.json();

    teamList.innerHTML = "";
    data.team.forEach((player, index) => {
        setTimeout(() => {
            let li = document.createElement("li");
            li.textContent = player;
            teamList.appendChild(li);
        }, index * 200);
    });
}
