import AppModel from './AppModel';
import AppView from './AppView';

class AppController {
  constructor () {
    this.appModel = new AppModel();
    this.appView = new AppView(this.setAppViewCallbacks());
  }
  setAppViewCallbacks() {
    return {cb1 : this.cb1, cb2 : this.cb2};
  }
  cb1 = () => {
    return 0;
  }
  cb2 = () => {
    return 0;
  }
}

export default AppController;
