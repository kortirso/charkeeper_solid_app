import { Show } from 'solid-js';

export const Label = (props) => (
  <Show when={props.labelText}>
    <label
      class={[props.labelClassList, 'text-sm/4 text-gray-400 dark:text-gray-200 flex-1'].join(' ')}
      classList={{ 'cursor-pointer': props.onClick }}
      onClick={props.onClick ? props.onClick : null} // eslint-disable-line solid/reactivity
    >
      {props.labelText}
    </label>
  </Show>
);


