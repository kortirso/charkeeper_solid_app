import { createSignal, createMemo, Show } from 'solid-js';
import * as i18n from '@solid-primitives/i18n';

import { IconButton } from '../../../components';
import { Dots, Avatar } from '../../../assets';
import pathfinder2Config from '../../../data/pathfinder2.json';
import dnd2024Config from '../../../data/dnd2024.json';
import { useAppState, useAppLocale, useAppAlert } from '../../../context';
import { clickOutside, copyToClipboard } from '../../../helpers';

const AVAILABLE_JSON = ['daggerheart'];

export const CharactersListItem = (props) => {
  const character = () => props.character;

  const [isOpen, setIsOpen] = createSignal(false);

  const [appState] = useAppState();
  const [{ renderNotice }] = useAppAlert();
  const [locale, dict] = useAppLocale();

  const t = i18n.translator(dict);

  const toggleMenu = (event) => {
    event.stopPropagation();

    setIsOpen(!isOpen());
  }

  const viewClick = (event) => {
    event.stopPropagation();

    props.onViewClick();
    setIsOpen(false);
  }

  const deleteClick = (event) => {
    setIsOpen(false);
    props.onDeleteCharacter(event);
  }

  const copy = (event) => {
    event.stopPropagation();

    copyToClipboard(`https://charkeeper.org/characters/${appState.activePageParams.id}.json`);
    renderNotice(t('alerts.copied'));
    setIsOpen(false);
  }

  const firstText = createMemo(() => {
    if (character().provider === 'dnd5') {
      return `${t('charactersPage.level')} ${character().level} | ${character().subrace ? t(`dnd5.subraces.${character().race}.${character().subrace}`) : t(`dnd5.races.${character().race}`)}`;
    }
    if (character().provider === 'dnd2024') {
      return `${t('charactersPage.level')} ${character().level} | ${character().legacy ? dnd2024Config.species[character().species].legacies[character().legacy].name[locale()] : dnd2024Config.species[character().species].name[locale()]}`;
    }
    if (character().provider === 'pathfinder2') {
      return `${t('charactersPage.level')} ${character().level} | ${character().subrace ? pathfinder2Config.races[character().race].subraces[character().subrace].name[locale()] : pathfinder2Config.races[character().race].name[locale()]}`;
    }
    if (character().provider === 'daggerheart') {
      return `${t('charactersPage.level')} ${character().level} | ${character().heritage ? props.daggerheartHeritages[character().heritage].name[locale()] : character().heritage_name}`;
    }
  });

  const secondText = createMemo(() => {
    if (character().provider === 'dnd5') {
      return Object.keys(character().classes).map((item) => t(`dnd5.classes.${item}`)).join(' * ');
    }
    if (character().provider === 'dnd2024') {
      return Object.keys(character().classes).map((item) => dnd2024Config.classes[item].name[locale()]).join(' * ');
    }
    if (character().provider === 'pathfinder2') {
      return Object.keys(character().classes).map((item) => pathfinder2Config.classes[item].name[locale()]).join(' * ');
    }
    if (character().provider === 'daggerheart') {
      return Object.keys(character().classes).map((item) => props.daggerheartClasses[item].name[locale()]).join(' * ');
    }
  });

  return (
    <div
      class="p-4 pb-0 pr-0 flex items-center cursor-pointer relative"
      classList={{
        'bg-white hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-dusty': !props.isActive,
        'bg-blue-400 dark:bg-fuzzy-red': props.isActive
      }}
      onClick={props.onClick} // eslint-disable-line solid/reactivity
    >
      <div class="mr-3 pb-4 dark:text-snow">
        <Show
          when={character().avatar}
          fallback={<Avatar width={64} height={64} />}
        >
          <img src={character().avatar} class="w-16 h-16 rounded" />
        </Show>
      </div>
      <div
        class="flex-1 flex pb-4 pr-4"
        classList={{
          'border-b border-gray-200 dark:border-dusty': !props.isActive,
          'border-b border-blue-400 dark:border-fuzzy-red': props.isActive
        }}>
        <div class="flex-1 overflow-hidden">
          <p class="font-normal! text-lg dark:text-snow truncate-text" classList={{ 'text-white': props.isActive }}>
            {character().name}
          </p>
          <p class="text-xs/4 text-gray-400 dark:text-gray-300" classList={{ 'text-white': props.isActive }}>
            {firstText()}
          </p>
          <p class="text-xs/4 text-gray-400 dark:text-gray-300" classList={{ 'text-white': props.isActive }}>
            {secondText()}
          </p>
        </div>
        <div class="relative h-16 dark:text-snow" use:clickOutside={() => setIsOpen(false)}>
          <IconButton onClick={toggleMenu}>
            <Dots />
          </IconButton>
          <Show when={isOpen()}>
            <div class="absolute z-9 right-0 border border-gray-200 rounded overflow-hidden">
              <p
                class="px-2 py-1 text-sm bg-white hover:bg-gray-200 dark:bg-dusty dark:hover:bg-neutral-800"
                onClick={deleteClick}
              >{t('charactersPage.onDeleteCharacter')}</p>
              <Show when={AVAILABLE_JSON.includes(character().provider)}>
                <p
                  class="px-2 py-1 text-sm bg-white hover:bg-gray-200 dark:bg-dusty dark:hover:bg-neutral-800"
                  onClick={copy}
                >{t('charactersPage.onCopyCharacter')}</p>
              </Show>
              <Show when={!window.__TAURI_INTERNALS__}>
                <p
                  class="px-2 py-1 text-sm bg-white hover:bg-gray-200 dark:bg-dusty dark:hover:bg-neutral-800"
                  onClick={(e) => viewClick(e)}
                >
                  PDF
                </p>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
