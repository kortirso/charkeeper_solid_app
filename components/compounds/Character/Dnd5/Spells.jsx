import { createSignal, For, Show, createMemo } from 'solid-js';
import * as i18n from '@solid-primitives/i18n';

import { Select, Checkbox, Toggle, Button } from '../../../atoms';
import { ErrorWrapper } from '../../../molecules';

import { useAppLocale } from '../../../../context';

export const Dnd5Spells = (props) => {
  const character = () => props.character;

  const [availableSpellFilter, setAvailableSpellFilter] = createSignal(true);
  const [activeSpellClass, setActiveSpellClass] = createSignal(props.initialSpellClassesList[0]);

  const [, dict] = useAppLocale();

  const t = i18n.translator(dict);

  const filteredSpellsList = createMemo(() => {
    const maxSpellLevel = character().spell_classes[activeSpellClass()].max_spell_level;

    return props.spells.filter((item) => {
      if (item.level > maxSpellLevel) return false;
      if (!availableSpellFilter()) return true;

      return item.available_for.includes(activeSpellClass());
    });
  });

  return (
    <ErrorWrapper payload={{ character_id: character().id, key: 'Dnd5Spells' }}>
      <div class="flex justify-between items-center mb-2">
        <Checkbox
          labelText={t('character.onlyAvailableSpells')}
          labelPosition="right"
          labelClassList="ml-2"
          checked={availableSpellFilter()}
          onToggle={() => setAvailableSpellFilter(!availableSpellFilter())}
        />
        <Show when={props.initialSpellClassesList.length > 1}>
          <Select
            classList="w-40"
            items={props.initialSpellClassesList.reduce((acc, item) => { acc[item] = t(`dnd5.classes.${item}`); return acc; }, {})}
            selectedValue={activeSpellClass()}
            onSelect={(value) => setActiveSpellClass(value)}
          />
        </Show>
      </div>
      <For each={[0].concat(Object.keys(character().spells_slots).map((item) => parseInt(item)))}>
        {(level) =>
          <Toggle title={level === 0 ? t('terms.cantrips') : `${level} ${t('spellbookPage.level')}`}>
            <table class="w-full table first-column-full-width">
              <tbody>
                <For each={filteredSpellsList().filter((item) => item.level === level)}>
                  {(spell) =>
                    <tr>
                      <td class="py-1">
                        <p class={`${props.knownSpellIds.includes(spell.id) ? '' : 'opacity-50'}`}>{spell.name}</p>
                        <Show
                          when={!availableSpellFilter()}
                          fallback={
                            <Show when={props.knownSpellIds.includes(spell.id)}>
                              <p class="text-xs mt-1">
                                {t(`dnd5.classes.${props.characterSpells.find((item) => item.spell_id === spell.id).prepared_by}`)}
                              </p>
                            </Show>
                          }
                        >
                          <p class="text-xs text-wrap">
                            {spell.available_for.map((item) => dict().dnd5.classes[item]).join(' * ')}
                          </p>
                        </Show>
                      </td>
                      <td>
                        <Show
                          when={props.knownSpellIds.includes(spell.id)}
                          fallback={
                            <p class="cursor-pointer" onClick={() => props.onLearnSpell(spell.id, activeSpellClass())}>{t('character.learn')}</p>
                          }
                        >
                          <p class="cursor-pointer" onClick={() => props.onForgetSpell(spell.id)}>{t('character.forget')}</p>
                        </Show>
                      </td>
                    </tr>
                  }
                </For>
              </tbody>
            </table>
          </Toggle>
        }
      </For>
      <Button default textable onClick={props.onNavigatoToSpellbook}>{t('back')}</Button>
    </ErrorWrapper>
  );
}
