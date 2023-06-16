import { BootstrapInterface } from './bootstrap.interface';
import { Container } from 'inversify';
import { App } from '../app';
import { appBindings } from './dependency.injection/app.bindings';
import { TYPES } from './dependency.injection/types';

export class Bootstrap implements BootstrapInterface {
	appContainer: Container;
	app: App;

	public async bootstrap(): Promise<BootstrapInterface> {
		this.appContainer = new Container();
		this.appContainer.load(appBindings);
		this.app = this.appContainer.get<App>(TYPES.Application);
		await this.app.init();

		return this;
	}
}
