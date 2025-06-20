import { createSignal, Show, children } from 'solid-js';

export const Toggle = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const safeChildren = children(() => props.children);

  return (
    <div class="white-box mb-2">
      <div class="py-2 px-4 cursor-pointer" onClick={() => setIsOpen(!isOpen())}>
        {props.title}
      </div>
      <Show when={isOpen()}>
        <div class="p-4 border-t border-gray-200">
          {safeChildren()}
        </div>
      </Show>
    </div>
  );
}
