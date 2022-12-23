import reset from './reset.css';
import css from "./style.css";
import JSZip from 'jszip';
import FileSaver from 'file-saver';


const inputFile = document.querySelector('.file-input');
const generatorButton = document.querySelector('.generate-button');
const errorContainer = document.querySelector('.error-container')
let readXml = null;

const generateDocuments = () => {
    let file = inputFile.files[0];
    if (file === undefined){
        errorContainer.textContent = 'please choose a file to generate documents'
        return
    } else {
        errorContainer.textContent = ''
    }
    
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = readAndChangeTargetAttributes;
}

const readAndChangeTargetAttributes = (e) => {
    readXml = e.target.result;
    var parser = new DOMParser();
    var doc = parser.parseFromString(readXml, "application/xml");
    generateZipWithDocuments(doc)
}

const generateZipWithDocuments = (doc) => {
    const zip = new JSZip();
    const duplicatesNumber = document.querySelector('#replicas').value;
    let currentDate = new Date();

    for (let i = 0; i < duplicatesNumber; i++) {
      let uuidNode = doc.getElementsByTagName('cbc:UUID')[0];
      uuidNode.textContent = crypto.randomUUID();
      let folioNode = doc.getElementsByTagName('cbc:ID')[0];
      folioNode.textContent = parseInt(folioNode.textContent) + 1;
      zip.file(`${folioNode.textContent}.xml`, doc.documentElement.outerHTML);
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()
        FileSaver.saveAs(content, `generated_documents-${time}.zip`);
    });
}

generatorButton.addEventListener('click', generateDocuments);

