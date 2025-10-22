import { For } from 'solid-js';

import { ErrorWrapper, GuideWrapper } from '../../../../components';
import config from '../../../../data/dc20.json';
import { useAppLocale } from '../../../../context';
import { modifier } from '../../../../helpers';

const TRANSLATION = {
  en: {
    saves: 'Saves',
    physical_save: 'Physical',
    mental_save: 'Mental'
  },
  ru: {
    saves: 'Спасы',
    physical_save: 'Физический',
    mental_save: 'Ментальный'
  }
}

export const Dc20Saves = (props) => {
  const character = () => props.character;

  const [locale] = useAppLocale();

  return (
    <ErrorWrapper payload={{ character_id: character().id, key: 'Dc20Saves' }}>
      <GuideWrapper character={character()}>
        <div class="blockable pt-2 pb-4">
          <p class="text-lg dark:text-snow mb-2 text-center">{TRANSLATION[locale()]['saves']}</p>
          <div class="flex flex-wrap emd:flex-nowrap gap-x-2 gap-y-4">
            <div class="w-full emd:w-1/3 flex">
              <For each={['physical_save', 'mental_save']}>
                {(slug) =>
                  <div class="flex-1">
                    <p class="text-sm uppercase text-center mb-4 dark:text-snow">
                      {TRANSLATION[locale()][slug]}
                    </p>
                    <div class="mx-auto flex items-center justify-center">
                      <p class="text-2xl font-normal! dark:text-snow">{modifier(character()[slug])}</p>
                    </div>
                  </div>
                }
              </For>
            </div>
            <div class="w-full emd:w-2/3 flex">
              <For each={['mig', 'agi', 'int', 'cha']}>
                {(slug) =>
                  <div class="flex-1">
                    <p class="text-sm uppercase text-center mb-4 dark:text-snow">
                      {config.abilities[slug].name[locale()]}
                    </p>
                    <div class="mx-auto flex items-center justify-center">
                      <p class="text-2xl font-normal! dark:text-snow">{modifier(character().attribute_saves[slug])}</p>
                    </div>
                  </div>
                }
              </For>
            </div>
          </div>
        </div>
      </GuideWrapper>
    </ErrorWrapper>
  );
}
