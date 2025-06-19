import { Model } from '@/trpc/routers/model.routers';
import { Pin, PinOff } from 'lucide-react';
import AppTooltip from '../common/app-tooltip';
import { TOKENIZER_LOGO_MAP } from './model-popover.constants';
import ModelCapabilities from './model-capabilities';
import { Button } from '../ui/button';

interface ModelSectionProps {
  models: Model[];
  isFavorite: boolean;
  toggleFavoriteModel: (params: { modelId: string }) => void;
  handleSelectModel: (model: Model) => void;
}

export default function ModelSection({
  isFavorite,
  models,
  toggleFavoriteModel,
  handleSelectModel,
}: ModelSectionProps) {
  return (
    <div className='flex flex-col gap-2'>
      <h3 className='flex items-center gap-1 text-muted-foreground font-medium'>
        {isFavorite ? (
          <>
            <Pin className='size-4' /> Favorites
          </>
        ) : (
          'Others'
        )}
      </h3>
      <div className='grid gap-4 grid-cols-2 md:grid-cols-3'>
        {models.map((model) => (
          <ModelGridItem
            key={model.id}
            handleSelect={() => handleSelectModel(model)}
            handleToggleFavorite={toggleFavoriteModel}
            isFavorite={isFavorite}
            model={model}
          />
        ))}
      </div>
    </div>
  );
}

interface ModelItemProps {
  model: Model;
  isFavorite: boolean;
  handleToggleFavorite: (params: { modelId: string }) => void;
  handleSelect: () => void;
}

function ModelGridItem({
  model,
  isFavorite,
  handleSelect,
  handleToggleFavorite,
}: ModelItemProps) {
  return (
    <div className='relative group/model-button w-full h-full'>
      <AppTooltip
        trigger={
          <button
            className='flex flex-col w-full h-full gap-6 items-center p-4 border border-border rounded-xl hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
            disabled={!model.id.includes(':free')}
            onClick={handleSelect}
          >
            <div className='flex-1 flex flex-col items-center gap-2'>
              {(() => {
                const TokenizerIcon =
                  TOKENIZER_LOGO_MAP[
                    model.architecture
                      .tokenizer as keyof typeof TOKENIZER_LOGO_MAP
                  ];
                return (
                  <AppTooltip trigger={<TokenizerIcon className='size-8' />}>
                    {model.architecture.tokenizer}
                  </AppTooltip>
                );
              })()}
              <p className='font-bold'>{model.name}</p>
            </div>
            <ModelCapabilities model={model} size='sm' />
          </button>
        }
      >
        <p className='max-w-60'>{model.description.split('.')[0]}</p>
      </AppTooltip>
      <div className='rounded-lg absolute -top-2 -right-2 hidden border border-border p-1 group-hover/model-button:block bg-white'>
        <Button
          onClick={() => handleToggleFavorite({ modelId: model.id })}
          className='size-8'
          size='icon'
          variant='secondary'
        >
          {isFavorite ? <PinOff /> : <Pin />}
        </Button>
      </div>
    </div>
  );
}
