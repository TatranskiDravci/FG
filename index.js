const MAX_IDX = 4;
const MIN_IDX = 1;
const TIMEOUT = 5000;

function promiseFactory(ms, i) {
    let promise = new Promise(resolve => setTimeout(resolve, ms));

    i++;
    if (i > MAX_IDX) {
        i = MIN_IDX;
    }

    promise.then(() => {
        document.getElementById("slide" + i).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).then(() => promiseFactory(ms, i))
    return
}

promiseFactory(TIMEOUT, MIN_IDX);