import { AppModel } from './AppModel';
import { AppView } from './AppView';

export default class AppController {
  constructor () {
    this.appModel = new AppModel();
    this.appView = new AppView();
  }
}
