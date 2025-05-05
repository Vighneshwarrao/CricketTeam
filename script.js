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
            document.getElementById(elementId).textContent += text.charAt(index);
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

window.onload = function () {
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
    const totalBowlers = formats[currentFormat].totalBowlers;
    const pace = parseInt(document.getElementById("pacers").value);
    const spin = parseInt(document.getElementById("spinners").value);

    if (changed === "pace") {
        document.getElementById("spinners").value = totalBowlers - pace;
    } else {
        document.getElementById("pacers").value = totalBowlers - spin;
    }
}

// Fetch Team with Loading State & Animated Reveal
async function fetchTeam() {
    const teamList = document.getElementById("team-list");
    teamList.innerHTML = "<li>Loading team...</li>";

    const bat = document.getElementById("batters").value;
    const pace = document.getElementById("pacers").value;
    const spin = document.getElementById("spinners").value;

    const url = `https://cricketapi-hs0m.onrender.com/${currentFormat}_team?bat=${bat}&pace=${pace}&spin=${spin}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        teamList.innerHTML = "";
        data.team.forEach((player, index) => {
            setTimeout(() => {
                const li = document.createElement("li");
                li.textContent = player;
                teamList.appendChild(li);
            }, index * 200);
        });
    } catch (error) {
        console.error("Fetch error:", error);
        teamList.innerHTML = "<li>Failed to load team. Please try again later.</li>";
    }
}
