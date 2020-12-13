import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToggleSidenav } from './app.actions';

export interface AppStateModel {
  layout?: {
    sidenavOpened: boolean;
  };
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    layout: {
      sidenavOpened: false
    }
  }
})
export class AppState {
  constructor() {}

  /**
   * Selectors
   */
  @Selector()
  static getLayoutSidenavOpened(state: AppStateModel) {
    return state.layout.sidenavOpened;
  }

  @Action(ToggleSidenav)
  toggleSidenave(sc: StateContext<AppStateModel>, event: ToggleSidenav) {
    const state = sc.getState();
    sc.patchState({
      layout: { ...state.layout, sidenavOpened: !state.layout.sidenavOpened }
    });
  }
}
