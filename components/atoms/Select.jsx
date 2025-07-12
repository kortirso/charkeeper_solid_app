import { createSignal, Show, For, splitProps } from 'solid-js';

import { Label } from './Label';
import { Chevron } from '../../assets';
import { clickOutside } from '../../helpers';

export const Select = (props) => {
  const [labelProps] = splitProps(props, ['labelText', 'labelClassList']);

  const [isOpen, setIsOpen] = createSignal(false);

  const onSelect = (value) => {
    props.onSelect(value);
    setIsOpen(false);
  }

  return (
    <div
      class={[props.containerClassList, 'form-field'].join(' ')}
      use:clickOutside={() => setIsOpen(false)}
    >
      <Label { ...labelProps } />
      <div class={[props.classList, 'relative cursor-pointer'].join(' ')}>
        <div
          class={[isOpen() ? 'is-open' : '', 'form-value flex justify-between items-center h-12'].join(' ')}
          onClick={() => setIsOpen(!isOpen())}
        >
          <span>{props.selectedValue ? props.items[props.selectedValue] : ''}</span>
          <Chevron rotated={isOpen()} />
        </div>
        <Show when={isOpen()}>
          <ul class="form-dropdown">
            <For each={Object.entries(props.items)}>
              {([key, value]) =>
                <li onClick={() => onSelect(key)}>
                  {value}
                </li>
              }
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
}
