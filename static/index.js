console.log("===== SOURCED =====");

const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 5000;
const TIMEOUT_LONG = 10000 - TIMEOUT;
let dead = 0;


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



