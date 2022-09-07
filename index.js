const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 1000;
const TIMEOUT_LONG = 10000 - TIMEOUT;
let dead = false;

function promiseFactory(ms, i) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => { resolve(); console.log("----- RESOLVED -----"); }, ms);
        addEventListener("touchstart", () => { reject(); dead = true; });
    });

    promise
    .then(() => {
        i++;
        if (i > MAX_IDX) {
            i = MIN_IDX;
        }
        document.getElementById("slide" + i).scrollIntoView({ behavior: 'smooth', block: 'center' });
        promiseFactory(ms, i);
    })
    .catch(() => {
        console.log("----- DEAD -----");
    });

    return
}

console.log("===== SOURCED =====");
promiseFactory(TIMEOUT, MIN_IDX);

addEventListener("touchend", () => {
    if (dead) {
        setTimeout(() => promiseFactory(TIMEOUT, MIN_IDX), TIMEOUT_LONG);
    }
});