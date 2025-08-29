// file: hargaJualMap.js

function generateMap(prefixes, startValue, step, maxNumber) {
    const map = {};
    for (const prefix of prefixes) {
        let value = startValue;
        for (let i = 5; i <= maxNumber; i += 5) {
            map[`${prefix}${i}`] = value;
            value += step;
        }
    }
    return map;
}

// generate untuk prefix t,i,tr,a,x,s, mulai t5=8000 misal semua sama step 3000 sampai 200
const generatedMap = generateMap(["t", "i", "tr", "a", "x", "s"], 8000, 3000, 200);

// mapping tambahan khusus misal pulsa tertentu
const additionalMap = {
    "p20": 23000,
    "p50": 53000,
};

// gabungkan semua
export const hargaJualMap = {
    ...generatedMap,
    ...additionalMap,
};
