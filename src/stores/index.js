import LoginStore from './LoginStore';
import ApplyStore from './ApplyStore';
import RecruitStore from './RecruitStore';
import QnaStore from './QnaStore';
import SessionStore from './SessionStore';

class RootStore {
    constructor() {
        this.loginStore = new LoginStore(this);
        this.applyStore = new ApplyStore(this);
        this.recruitStore = new RecruitStore(this);
        this.qnaStore = new QnaStore(this);
        this.sessionStore = new SessionStore(this);
    }
}

export default RootStore;