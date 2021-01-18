import * as monaco from "monaco-editor-core";
import { WorkerAccessor } from "./setup";
import { languageID } from "./config";
import { ITodoLangError } from "../language-service/TodoLangErrorListener";

export default class DiagnosticsAdapter {
    constructor(private worker: WorkerAccessor) {
        const onModelAdd = (model: monaco.editor.IModel): void => {
            let handle: any;
            model.onDidChangeContent(() => {
                
               // chaque fois qu'il y a un nouveau changement on attend 500ms avant la validation
                clearTimeout(handle);
                handle = setTimeout(() => this.validate(model.uri), 500);
            });

            this.validate(model.uri);
        };
        monaco.editor.onDidCreateModel(onModelAdd);
        monaco.editor.getModels().forEach(onModelAdd);
    }
    private async validate(resource: monaco.Uri): Promise<void> {
        // recuperer le proxy worker
        const worker = await this.worker(resource)
        // appeler la methode validation proxy du langage service et recuperer les erreur
        const errorMarkers = await worker.doValidation();
        // recuperer le model 
        const model = monaco.editor.getModel(resource);
        //  ajouter le marqueur de l'erreur et les souligner 
        monaco.editor.setModelMarkers(model, languageID, errorMarkers.map(toDiagnostics));

    }
}
function toDiagnostics(error: ITodoLangError): monaco.editor.IMarkerData {
    return {
        ...error,
        severity: monaco.MarkerSeverity.Error,
    };
}