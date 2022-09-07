const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 3000;
const TIMEOUT_LONG = 10000 - TIMEOUT;
let dead = false;

function promiseFactory(ms, i, parent) {
    console.log(i, parent);
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => { resolve(); console.log("----- RESOLVED -----"); }, ms);
        addEventListener("touchstart", () => { reject(); console.log("----- REJECTED -----"); dead = true; });
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

console.log("===== SOURCED =====");
promiseFactory(TIMEOUT, MIN_IDX, "source-1");

addEventListener("touchend", () => {
    if (dead) {
        promiseFactory(TIMEOUT, MIN_IDX, "resurrected-1")
    }
});