const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 3000;

function promiseFactory(ms, i) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
        addEventListener("touchstart", reject);
    });

    promise.catch(() => {
        addEventListener("touchend", () => promiseFactory(5000, i));
    });

    i++;
    if (i > MAX_IDX) {
        i = MIN_IDX;
    }

    promise
    .then(() => {
        document.getElementById("slide" + i).scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .then(() => promiseFactory(ms, i));

    return
}

console.log("===== SOURCED =====");
promiseFactory(TIMEOUT, MIN_IDX);