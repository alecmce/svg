import { Signal } from './signal';

export interface Container {
  readonly resize: Signal<void>;
}