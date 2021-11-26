import { expressProxy } from '$share/express-proxy';

const proxy = expressProxy();

proxy.get('/me', 'Auth:Me');

export const authRouter = proxy.router;