import { Container } from 'inversify';
import { App } from '../app';

export interface BootstrapInterface {
	appContainer: Container;
	app: App;
}
