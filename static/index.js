console.log("===== SOURCED =====");

const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 3000;
const TIMEOUT_LONG = 10000 - TIMEOUT;
let dead = 0;

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

promiseFactory(TIMEOUT, MIN_IDX, "source-1");

addEventListener("touchend", () => {
    if (dead == 1) {
        promiseFactory(TIMEOUT, MIN_IDX, "resurrected-1");
        dead = 0;
    }
});

addEventListener("focusout", () => {
    if (dead) {
        promiseFactory(TIMEOUT, MIN_IDX, "resurrected-1");
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
        let li = document.createElement("li");
        let h = document.createElement("h1");
        let p_loc = document.createElement("p");
        let p_pay = document.createElement("p");

        h.innerHTML = item.title;
        p_loc.innerHTML = item.loc;
        p_pay.innerHTML = item.pay;

        li.append(h);
        li.append(p_loc);
        li.append(p_pay);

        li.addEventListener("click", () => { 
            fetch("/click").then(() => window.location.href = item.url);
        });

        ul.append(li);
    });
}

populate();



