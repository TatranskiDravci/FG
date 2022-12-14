console.log("===== SOURCED =====");

const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 5000;
const TIMEOUT_LONG = 10000 - TIMEOUT;
const kill = new Event("kill");
let dead = 0;

// ewwww
function getNearestSlide() {
    return (
        ( 0                   <= window.pageYOffset && window.pageYOffset <   window.innerHeight) * 1 +
        ( window.innerHeight  <= window.pageYOffset && window.pageYOffset < 2*window.innerHeight) * 2 +
        (2*window.innerHeight <= window.pageYOffset && window.pageYOffset < 3*window.innerHeight) * 3 +
        (3*window.innerHeight <= window.pageYOffset && window.pageYOffset < 4*window.innerHeight) * 4
    )
}


function promiseFactory(ms, i, parent) {
    console.log(i, parent);
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => { resolve(); console.log("----- RESOLVED -----"); }, ms);
        addEventListener("touchstart", () => { reject(); console.log("----- REJECTED: touchstart -----"); dead = 1; });
        addEventListener("kill", () => { reject(); console.log("----- REJECTED: direct kill -----"); dead = 1; });
        document.getElementById("mail").addEventListener("focusin", () => {
            reject();
            console.log("----- REJECTED: focus -----");
            dead = 2;
        }, true);
        document.getElementById("mail").addEventListener("focus", () => {
            reject();
            console.log("----- REJECTED: focus -----");
            dead = 2;
        }, true);
    });

    promise
    .then(() => {
        i++;
        if (i > MAX_IDX) {
            i = MIN_IDX;
        }
        document.getElementById("slide" + i).scrollIntoView({ behavior: 'smooth', block: 'center' });
        promiseFactory(ms, i, parent + "-resolve-" + i);
    })
    .catch(() => {
        console.log("----- DEAD -----");
    });

    return
}

promiseFactory(TIMEOUT, getNearestSlide(), "source-" + getNearestSlide());

addEventListener("touchend", () => {
    if (dead == 1) {
        setTimeout(promiseFactory(TIMEOUT, getNearestSlide(), "resurrected-" + getNearestSlide()), TIMEOUT_LONG);
        dead = 0;
    }
});

addEventListener("focusout", () => {
    if (dead) {
        setTimeout(promiseFactory(TIMEOUT, getNearestSlide(), "resurrected-" + getNearestSlide()), TIMEOUT_LONG);
        dead = 0;
    }
});

async function populate() {
    const requestURL = 'static/profesia.json';
    const request = new Request(requestURL);
    const response = await fetch(request);
    const profesia = await response.text();
    const obj = JSON.parse(profesia);

    const ul = document.getElementById("profesia_embed");

    obj.forEach(item => {
        let li = document.createElement("div");
        let h = document.createElement("div");
        let p_loc = document.createElement("div");
        let p_pay = document.createElement("div");

        h.innerHTML = item.title;
        p_loc.innerHTML = item.loc;
        p_pay.innerHTML = item.pay;

        h.classList.add("list_title");
        h.classList.add("h2");
        p_loc.classList.add("list_loc");
        p_pay.classList.add("list_money");

        li.classList.add("grey");
        li.classList.add("embed_card")

        li.append(h);
        li.append(p_loc);
        li.append(p_pay);

        li.addEventListener("click", () => { 
            fetch("/click").then(() => window.open(item.url));
        });

        ul.append(li);
    });
}

populate();

document.querySelectorAll(".polls").forEach(item => {
    item.addEventListener("click", event => {
        fetch("/poll?num=" + encodeURIComponent(item.getAttribute("num")));
        //document.getElementById("slide1").scrollIntoView({ behavior: 'auto', block: 'center' });
        dispatchEvent(kill);
        var bublinka = document.getElementById("voted");
        var nadpis = document.getElementById("nadpisslide4");
        var tlacitko1 = document.getElementById("name1");
        var tlacitko2 = document.getElementById("name2");
        var tlacitko3 = document.getElementById("name3");
        bublinka.className = "snackbar show";
        nadpis.className = "h1 hide";
        tlacitko1.className = "list_names polls hide";
        tlacitko2.className = "list_names polls hide";
        tlacitko3.className = "list_names polls hide";
        setTimeout(() => {
                bublinka.className = bublinka.className.replace(" show", "");
                nadpis.className = nadpis.className.replace(" hide", "");
                tlacitko1.className = tlacitko1.className.replace(" hide", "");
                tlacitko2.className = tlacitko2.className.replace(" hide", "");
                tlacitko3.className = tlacitko3.className.replace(" hide", "");
                if (dead == 1) {
                    setTimeout(promiseFactory(TIMEOUT, getNearestSlide(), "resurrected-" + getNearestSlide()), TIMEOUT_LONG);
                    dead = 0;
                }
            }, 3000);
    });
});