export function loadImage(src) {
    const img = new Image();
    img.src = src;
    return new Promise(resolve => {
        img.onload = () => resolve(img);
    });
}

export function readFile(fileData) {
    let reader = new FileReader();
    return new Promise(resolve => {
        reader.onload = () => resolve(reader);
        reader.readAsDataURL(fileData, reader.result);
    });
}