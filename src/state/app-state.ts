import autoBind from 'auto-bind';
import { PromptStore } from './prompt-store';
import { FileStore } from './file-store';
import { ViewStore } from './view-store';
import { RouterState, createRouterState } from './router-state';
import { ModalState, createModalState } from './modal-state';

export const CREATE_NEW_RECORD = Symbol('CREATE_NEW_RECORD')

export interface AppState {
  router: RouterState;
  files: FileStore;
  views: ViewStore;
  prompt: PromptStore;
  modal: ModalState;
}

export function createAppState(): AppState {
  const router = createRouterState({
    name: 'default',
  })
  const files = new FileStore()
  const views = new ViewStore(
    files.current,
    files.configFile,
    router
  )
  const prompt = new PromptStore()
  const modal = createModalState()

  autoBind(views)
  autoBind(files)
  autoBind(prompt)

  return {
    router,
    files,
    views,
    prompt,
    modal,
  }
}
