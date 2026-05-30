import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const arr = new sd.Array(svg).resize(n);

sd.init(() => {
    sd.Pointer(arr, "l", "b", 5, 30, 5).moveTo(3);
    sd.Pointer(arr, "r", "b", 5, 30, 5).moveTo(7);
})

sd.main(async () => {
    
})