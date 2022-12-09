const v8 = require('v8');

const shuffle = (s) => {
    const n = s.length;
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = s[i];
        s[i] = s[j];
        s[j] = tmp;
    }
    return s.join('');
};

let counter = 0
const createSeed = () => {
    const { 
        total_physical_size,
        total_available_size,
        used_heap_size
    } = v8.getHeapStatistics();
    const uptime = process.uptime();
    counter += 1;

    let seed = process.pid + process.ppid;
    const nums = [
        total_physical_size,
        uptime,
        total_available_size,
        used_heap_size
    ];

    let highorder = seed & 0xf8000000; 
    for (const num of nums) {
        seed <<= 5;
        seed ^= highorder >> 27;
        seed ^= num;
        highorder = seed & 0xf8000000;
    }

    return counter.toString() + seed.toString() + uptime.toString()
}

const toUrlSafe = (c) => {
    switch (c) {
        case '+':
            return '.';
        case '/':
            return '-';
        case '=':
            return '-';
        default:
            return c;
    };
}

const randomToken = () => {
    return shuffle(
        Buffer.from(createSeed())
        .toString('base64')
        .split('')
        .map(toUrlSafe)
    ).slice(0,21);
}

module.exports = randomToken;