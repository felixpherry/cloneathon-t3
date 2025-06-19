import { Model } from '@/trpc/routers/model.routers';
import { getTokenizerIcon, isModelFree } from './model-popover.helpers';
import { Button } from '../ui/button';
import AppTooltip from '../common/app-tooltip';
import { Info } from 'lucide-react';
import ModelCapabilities from './model-capabilities';
import { cn } from '@/lib/utils';

export default function FavoriteModelsList({
  favoriteModels,
  handleSelectModel,
}: {
  favoriteModels: Model[];
  handleSelectModel: (model: Model) => void;
}) {
  return (
    <div className={cn('flex flex-col gap-2')}>
      {favoriteModels.length === 0 ? (
        <p className='mx-auto text-sm text-muted-foreground'>
          No Favorite Models
        </p>
      ) : null}
      {favoriteModels.map((model) => (
        <ModelListItem
          key={model.id}
          model={model}
          handleSelect={() => handleSelectModel(model)}
        />
      ))}
    </div>
  );
}

interface ModelListItemProps {
  model: Model;
  handleSelect: () => void;
}
function ModelListItem({ model, handleSelect }: ModelListItemProps) {
  const isFree = isModelFree(model);
  const TokenizerIcon = getTokenizerIcon(model.architecture.tokenizer);
  return (
    <Button
      className='justify-start'
      variant='ghost'
      disabled={!isFree}
      onClick={handleSelect}
    >
      <AppTooltip trigger={<TokenizerIcon />}>
        {model.architecture.tokenizer}
      </AppTooltip>
      {model.name}
      <AppTooltip trigger={<Info />}>
        <p className='max-w-60'>{model.description.split('.')[0]}</p>
      </AppTooltip>
      <div className='flex items-center gap-2 ml-auto'>
        <ModelCapabilities model={model} size='md' />
      </div>
    </Button>
  );
}
