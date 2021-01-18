import * as monaco from "monaco-editor-core";
import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;

export const richLanguageConfiguration: IRichLanguageConfiguration = {
    
};

export const monarchLanguage = <ILanguage>{
    // invalider le defaultToken pour voir ce quin'est pas sous token
    defaultToken: 'invalid',
    keywords: [
        'COMPLETE', 'ADD',
    ],
    typeKeywords: ['TODO'],
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    
    tokenizer: {
        root: [
            // identifiants et mots clé
            [/[a-zA-Z_$][\w$]*/, {
                cases: {
                    '@keywords': { token: 'keyword' },
                    '@typeKeywords': { token: 'type' },
                    '@default': 'identifier'
                }
            }],
            
            { include: '@whitespace' },
            
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  
            [/"/, 'string', '@string'],
        ],
        whitespace: [
			[/[ \t\r\n]+/, ''],
		],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ]
    },
}