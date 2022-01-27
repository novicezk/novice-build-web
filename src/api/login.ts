import rest from './rest'

export default class Login {
    shouldShowCaptcha(username: string) {
        return rest.get('/us.User/should-show-captcha?username=' + username);
    }
    login(params: object) {
        return rest.request({
            method: 'post', url: '/login', params: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
    logout() {
        return rest.get('/logout');
    }
}
