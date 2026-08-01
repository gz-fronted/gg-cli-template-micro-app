import { defineMock } from '@/mock/runtime';

export default defineMock({
  '/example/ping.get': {
    res: {
      message: 'pong',
    },
  },
});
