import { BootstrapInterface } from './bootstrap.interface';
import { Container } from 'inversify';
import { App } from '../app';
import { appBindings } from './dependency.injection/app.bindings';
import { TYPES } from './dependency.injection/types';

export class Bootstrap implements BootstrapInterface {
	appContainer: Container;
	app: App;

	constructor() {
		this.appContainer = new Container();
		this.app = this.appContainer.get<App>(TYPES.Application);
	}

	public async bootstrap(): Promise<BootstrapInterface> {
		console.log('TRY BOOTSTRAP');
		this.appContainer.load(appBindings);
		await this.app.init();

		return this;
	}
}
