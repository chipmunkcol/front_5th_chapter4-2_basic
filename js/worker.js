onmessage = function (e) {
    complexFn();
    this.postMessage('무거운 연산 끝!');
}

// Simulate heavy operation. It could be a complex price calculation.
function complexFn() {
    for (let i = 0; i < 10000000; i++) {
        const temp = Math.sqrt(i) * Math.sqrt(i);
    }
}