import * as monaco from "monaco-editor-core";

import Uri = monaco.Uri;
import { TodoLangWorker } from './todoLangWorker';
import { languageID } from './config';

export class WorkerManager {

	private worker: monaco.editor.MonacoWebWorker<TodoLangWorker>;
	private workerClientProxy: Promise<TodoLangWorker>;

	constructor() {
		this.worker = null;
	}

	private getClientproxy(): Promise<TodoLangWorker> {

		if (!this.workerClientProxy) {
			this.worker = monaco.editor.createWebWorker<TodoLangWorker>({
				// module qui exporte la methode create et retourne l'instantce 'JSONWorker' 
				moduleId: 'TodoLangWorker',
				label: languageID,
				// method passer dans la methode create()
				createData: {
					languageId: languageID,
				}
			});

			this.workerClientProxy = <Promise<TodoLangWorker>><any>this.worker.getProxy();
		}

		return this.workerClientProxy;
	}

	async getLanguageServiceWorker(...resources: Uri[]): Promise<TodoLangWorker> {
		const _client: TodoLangWorker = await this.getClientproxy();
		await this.worker.withSyncedResources(resources)
		return _client;
	}
}