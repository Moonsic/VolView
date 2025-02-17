import { onBeforeUnmount, onMounted } from 'vue';
import { captureException } from '@sentry/vue';
import { useMessageStore } from '../store/messages';

export function useGlobalErrorHook() {
  const messageStore = useMessageStore();

  const onError = (event: ErrorEvent) => {
    // console.error(event); // GGG注释掉
    const errorMessage = event.message ?? 'Unknown global error';

    captureException(event.error ?? errorMessage);

    const details = event.error ? event.error : { details: errorMessage };
    console.log('error: ', details); // GGG添加

    // messageStore.addError('Application error (click for details)', details); // GGG注释掉，左下角不弹出报错
  };

  onMounted(() => {
    window.addEventListener('error', onError);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('error', onError);
  });
}
