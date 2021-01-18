import { TodoExpressionsContext, AddExpressionContext, CompleteExpressionContext } from "../ANTLR/TodoLangGrammarParser";
import { parseAndGetASTRoot, parseAndGetSyntaxErrors } from "./Parser";
import { ITodoLangError } from "./TodoLangErrorListener";

export default class TodoLangLanguageService {
    validate(code: string): ITodoLangError[] {
        const syntaxErrors: ITodoLangError[] = parseAndGetSyntaxErrors(code);
        const ast: TodoExpressionsContext = parseAndGetASTRoot(code);
        return syntaxErrors.concat(checkSemanticRules(ast));
    }
    format(code: string): string{
        
        // formatter que le code valide
        if(this.validate(code).length > 0)
            return code;
        let formattedCode = "";
        const ast: TodoExpressionsContext = parseAndGetASTRoot(code);
        ast.children.forEach(node => {
            if (node instanceof AddExpressionContext) {
                // if a Add expression : ADD TODO "STRING"
                const todo = node.STRING().text;
                formattedCode += `ADD TODO ${todo}\n`;
            }else if(node instanceof CompleteExpressionContext) {
                // If a Complete expression: COMPLETE TODO "STRING"
                const todoToComplete = node.STRING().text;
                formattedCode += `COMPLETE TODO ${todoToComplete}\n`;
            }
        });
        return formattedCode;
    }
}

function checkSemanticRules(ast: TodoExpressionsContext): ITodoLangError[] {
    const errors: ITodoLangError[] = [];
    const definedTodos: string[] = [];
    ast.children.forEach(node => {
        if (node instanceof AddExpressionContext) {
            // if a Add expression : ADD TODO "STRING"
            const todo = node.STRING().text;
            // if TODO est défini en utilisant linstruction ADD TODO on peut le réajouter
            if (definedTodos.some(todo_ => todo_ === todo)) {
                // node a toute les informations pour connaitre la position de cette expression dans le code
                errors.push({
                    code: "2",
                    endColumn: node.stop.charPositionInLine + node.stop.stopIndex - node.stop.stopIndex,
                    endLineNumber: node.stop.line,
                    message: `Todo ${todo} already defined`,
                    startColumn: node.stop.charPositionInLine,
                    startLineNumber: node.stop.line
                });
            } else {
                definedTodos.push(todo);
            }
        }else if(node instanceof CompleteExpressionContext) {
            const todoToComplete = node.STRING().text;
            if(definedTodos.every(todo_ => todo_ !== todoToComplete)){
                
                // if todo n'est pas encore défini on check les todo predefini jusqu'a cette expression (l'ordre est important)
                errors.push({
                    code: "2",
                    endColumn: node.stop.charPositionInLine + node.stop.stopIndex - node.stop.stopIndex,
                    endLineNumber: node.stop.line,
                    message: `Todo ${todoToComplete} is not defined`,
                    startColumn: node.stop.charPositionInLine,
                    startLineNumber: node.stop.line
                });
            }
        }

    })
    return errors;
}