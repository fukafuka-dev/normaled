import ThreeScene from "./ThreeScene"
import { convertToNormalMap, initCanvas, shrinkSize, getCanvas } from "./image.js"
import { loadImage, readFile } from "./promise.js"
import sampletex from "../images/sampletex.jpg"
import "../images/white0023.png"
import "../styles/index.css"
import $ from "jquery"

$(() =>{
    const canvasWidth = 400;
    const canvasHeight = 400;

    // append renderer
    const screen = initScreen();

    // ----------------------------------------------------------------------

    $("#level").on("input",function() {
        const original = getCanvas("originalCanvas");
        const normalMap = getCanvas("normalMapCanvas");
        reflectNormalToCanvas(original, normalMap);    
    });

    $("#level").change(() => {
        reflectNormalToModel();
    });

    $("#invertCheck").change(() => {
        const original = getCanvas("originalCanvas");
        const normalMap = getCanvas("normalMapCanvas");
        reflectNormalToCanvas(original, normalMap);   
        reflectNormalToModel();
    });

    $("#modelType").change(() => {
        changeModel();
    });

    $("#file").change((e) => {
        // file open
        let fileData = e.target.files[0];
            if(!fileData.type.match('image.*')) {
            alert('画像を選択してください');
            return;
        }

        // file reader
        readFile(fileData).then((reader) => {
            loadImage(reader.result).then((img) => {
                updateScreen(img);
            });  
        });    
    });
    // ----------------------------------------------------------------------

    function reflectNormalToCanvas(original, normalMap) {
        normalMap.context.putImageData(convertToNormalMap(original.canvas, getAmp(), getInvertFlag()), 0, 0);
    }

    function reflectNormalToModel() {
        const normalMap = getCanvas("normalMapCanvas");
        screen.changeTexture(normalMap.canvas.toDataURL());
    }

    function getInvertFlag() {
        return $("#invertCheck").prop('checked');
    }

    function getAmp() {
        return Math.pow($("#level").val() / 100, 2);
    }

    function changeModel() {
        const selected = $("[name=modelType] option:selected").val();
        screen.changeShape(selected);
        reflectNormalToModel();
    }

    function initScreen() {
        // new screen
        const screen = new ThreeScene(canvasWidth, canvasHeight);
        $("#preview").append(screen.getRendereDom());

        // load default texture
        loadImage(sampletex).then((defaultImage) => {
            const normalMap = getCanvas("normalMapCanvas");
            screen.create(normalMap.canvas.toDataURL());
            updateScreen(defaultImage);
        });

        return screen;
    }

    function updateScreen(img) {
        // shrink size
        const { width, height } = shrinkSize(img.naturalWidth, img.naturalHeight, canvasWidth, canvasHeight);

        // init canvas
        const original = initCanvas("originalCanvas", width, height);
        original.context.drawImage(img, 0, 0, width, height);
        const normalMap = initCanvas("normalMapCanvas", width, height);
        reflectNormalToCanvas(original, normalMap);

        // set normal to screen
        reflectNormalToModel();      
    }
}); 
