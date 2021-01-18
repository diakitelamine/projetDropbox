import { ANTLRErrorListener, RecognitionException, Recognizer } from "antlr4ts";


export interface ITodoLangError {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
    message: string;
    code: string;
}

export default class TodoLangErrorListener implements ANTLRErrorListener<any>{
    private errors: ITodoLangError[] = []
    syntaxError(recognizer: Recognizer<any, any>, offendingSymbol: any, line: number, charPositionInLine: number, message: string, e: RecognitionException | undefined): void {
        
        this.errors.push(
            {
                startLineNumber:line,
                endLineNumber: line,
                startColumn: charPositionInLine,
                endColumn: charPositionInLine+1,//on suppose que la length de l'erreur est 1 char pour la simplicité
                message,
                code: "1" // on peut customiser l'erreur comme on 'veut
            }
        )
    }

    getErrors(): ITodoLangError[] {
        return this.errors;
    }
}