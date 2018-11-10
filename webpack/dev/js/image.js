function invert(amp){
    return 1 - amp;
}

function returnLuminance(v, index, amp){
    return v[index] * 0.298912 * amp
         + v[index + 1] * 0.586611 * amp
         + v[index + 2] * 0.114478 * amp;
}

function vec3Normalize(v){
    let e;
    let n = [0.0, 0.0, 0.0];
    let l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if(l > 0){
        e = 1.0 / l;
        n[0] = v[0] * e;
        n[1] = v[1] * e;
        n[2] = v[2] * e;
    }
    return n;
}

function vec3Cross(v1, v2){
    let n = [0.0, 0.0, 0.0];
    n[0] = v1[1] * v2[2] - v1[2] * v2[1];
    n[1] = v1[2] * v2[0] - v1[0] * v2[2];
    n[2] = v1[0] * v2[1] - v1[1] * v2[0];
    return n;
}

export function convertToNormalMap(src, amp = 0.5, invertFlag = false){
    let i, j, k, l, m, n, o;
    let g, f;
    let width = src.width;
    let height = src.height;
    let ctx = src.getContext('2d');
    f = ctx.getImageData(0, 0, width, height);
    g = ctx.createImageData(f);
    for(i = 0; i < width; i++){
        for(j = 0; j < height; j++){


            k = (i - 1 < 0 ? 0 : i - 1) + j * width;
            m = returnLuminance(f.data, k * 4, amp);
            m = invertFlag ? invert(m) : m;

            k = (i + 1 > width - 1 ? i : i + 1) + j * width;
            n = returnLuminance(f.data, k * 4, amp);
            n = invertFlag ? invert(n) : n;

            l = (n - m) * 0.5;

            k = i + ((j - 1) < 0 ? 0 : j - 1) * width;
            m = returnLuminance(f.data, k * 4, amp);
            m = invertFlag ? invert(m) : m;

            k = i + ((j + 1) > height - 1 ? j : j + 1) * width;
            n = returnLuminance(f.data, k * 4, amp);
            n = invertFlag ? invert(n) : n;

            o = (n - m) * 0.5;

            let dyx = [0.0,  l,  1.0];
            let dyz = [1.0, -o,  0.0];
            let dest = vec3Normalize(vec3Cross(dyx, dyz));
            k = i + j * width;
            g.data[k * 4]     = Math.floor((dest[2] + 1.0) * 0.5 * 255);
            g.data[k * 4 + 1] = Math.floor((dest[0] + 1.0) * 0.5 * 255);
            g.data[k * 4 + 2] = Math.floor((dest[1] + 1.0) * 0.5 * 255);
            g.data[k * 4 + 3] = 255;
        }
    }
    return g;
}

export function getCanvas(id) {
    let canvas = document.getElementById(id);
    let context = canvas.getContext('2d');
    return { canvas:canvas, context:context }
}

export function initCanvas(id, w, h) {
    let canvas = document.getElementById(id);
    canvas.width = w;
    canvas.height = h;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    return { canvas:canvas, context:context }
}

export function shrinkSize(w, h, canvasWidth, canvasHeight) {
    let rate = 1;
    if (w > h) {
        rate = canvasWidth / w;
    } else {
        rate = canvasHeight / h;
    }
    
    return {
        width: w * rate,
        height: h * rate,
    };
}