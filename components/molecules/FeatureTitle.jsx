import { Show, Switch, Match } from 'solid-js';
import * as i18n from '@solid-primitives/i18n';

import { Button } from '../../components';
import { useAppLocale } from '../../context';
import { PlusSmall, Minus, Campfire, LongCampfire, Moon, Picnic } from '../../assets';

export const FeatureTitle = (props) => {
  const feature = () => props.feature;

  const [, dict] = useAppLocale();

  const t = i18n.translator(dict);

  return (
    <Show when={feature().limit !== undefined} fallback={feature().title}>
      <div class="flex items-center">
        <p class="flex-1">{feature().title}</p>
        <div class="flex items-center">
          <Button default size="small" onClick={(event) => feature().used_count !== feature().limit ? props.onSpendEnergy(event, feature()) : event.stopPropagation()}>
            <Minus />
          </Button>
          <p class="flex items-center justify-center mx-2">
            <span class="w-6 text-center">{feature().limit - (feature().used_count || 0)}</span>
            <Switch>
              <Match when={feature().limit_refresh === 'one_at_short_rest'}>
                <span title={t('rest.oneAtShortRest')}><Picnic /></span>
              </Match>
              <Match when={feature().limit_refresh === 'short_rest'}>
                <span title={t('rest.shortRest')}><Campfire /></span>
              </Match>
              <Match when={feature().limit_refresh === 'long_rest'}>
                <span title={t('rest.longRest')}><LongCampfire /></span>
              </Match>
              <Match when={feature().limit_refresh === 'session'}>
                <span title={t('rest.sessionRest')}><Moon width={16} height={16} /></span>
              </Match>
            </Switch>
          </p>
          <Button default size="small" onClick={(event) => (feature().used_count || 0) > 0 ? props.onRestoreEnergy(event, feature()) : event.stopPropagation()}>
            <PlusSmall />
          </Button>
        </div>
      </div>
    </Show>
  );
}
