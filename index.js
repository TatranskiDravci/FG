const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 1000;

function promiseFactory(ms, i) {
    console.log(i);
    let promise = new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
        addEventListener("touchstart", reject);
    });

    promise.catch(() => {
        console.log("===== TOUCHED =====");
        addEventListener("touchend", event => {
            promiseFactory(5000, i);
            console.log(event);
        });
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