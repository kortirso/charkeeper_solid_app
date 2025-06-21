import { createSignal, createEffect, Switch, Match, Show } from 'solid-js';
import { createWindowSize } from '@solid-primitives/resize-observer';

import { Dnd5, Pathfinder2, Daggerheart } from '../../components';
import { PageHeader } from '../../components/molecules';
import { IconButton } from '../../components/atoms';
import { Arrow } from '../../assets';
import { useAppState } from '../../context';
import { fetchCharacterRequest } from '../../requests/fetchCharacterRequest';

export const CharacterTab = (props) => {
  const size = createWindowSize();
  const [character, setCharacter] = createSignal({});
  const [appState] = useAppState();

  createEffect(() => {
    if (appState.activePageParams.id === character().id) return;

    const fetchCharacter = async () => await fetchCharacterRequest(appState.accessToken, appState.activePageParams.id);

    Promise.all([fetchCharacter()]).then(
      ([characterData]) => {
        setCharacter(characterData.character);
      }
    );
  });

  const reloadCharacter = async () => {
    const characterData = await fetchCharacterRequest(appState.accessToken, appState.activePageParams.id);
    setCharacter(characterData.character);

    return characterData.character;
  }

  const replaceCharacter = (data) => setCharacter({ ...character(), ...data });

  return (
    <>
      <Show when={size.width < 768}>
        <PageHeader
          leftContent={
            <IconButton size="xl" onClick={props.onNavigate}>
              <Arrow back />
            </IconButton>
          }
        >
          <p>{character().name}</p>
        </PageHeader>
      </Show>
      <Switch>
        <Match when={character().provider === 'dnd5' || character().provider === 'dnd2024'}>
          <Dnd5
            character={character()}
            onReloadCharacter={reloadCharacter}
            onReplaceCharacter={replaceCharacter}
          />
        </Match>
        <Match when={character().provider === 'pathfinder2'}>
          <Pathfinder2
            character={character()}
            onReplaceCharacter={replaceCharacter}
          />
        </Match>
        <Match when={character().provider === 'daggerheart'}>
          <Daggerheart
            character={character()}
            onReloadCharacter={reloadCharacter}
            onReplaceCharacter={replaceCharacter}
          />
        </Match>
      </Switch>
    </>
  );
}
