'use client';

import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import SearchInput from '../common/search-input';
import React from 'react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { Model } from '@/trpc/routers/model.routers';
import { useModel } from '../model-provider';
import useModelData from './use-model-data';
import {
  filterModels,
  partitionModelsByFavorite,
} from './model-popover.helpers';
import useFavoriteModelsMutation from './use-favorite-models-mutation';
import FavoriteModelsList from './favorite-models-list';
import ModelSection from './model-section';

export default function ModelPopover() {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const { models, favoriteModelIds } = useModelData();
  const filteredModels = filterModels(models, search);
  const { favoriteModels, otherModels } = partitionModelsByFavorite(
    filteredModels,
    favoriteModelIds
  );

  const { mutate: toggleFavoriteModel } = useFavoriteModelsMutation();

  const [showAll, setShowAll] = React.useState(false);
  const { model, setModel } = useModel();

  function handleSelectModel(model: Model) {
    setModel(model);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' className='font-semibold' size='sm'>
          {model?.name} <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className={cn(
          'px-2 py-2 flex flex-col gap-4 max-w-full',
          showAll ? 'w-150 ' : 'w-120'
        )}
      >
        <div className='px-3'>
          <SearchInput
            placeholder='Search models...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={cn('overflow-auto overscroll-none max-h-[77svh]')}>
          {showAll ? (
            <div className='px-3 flex flex-col gap-4'>
              <ModelSection
                isFavorite={true}
                models={favoriteModels}
                toggleFavoriteModel={toggleFavoriteModel}
                handleSelectModel={handleSelectModel}
              />
              <ModelSection
                isFavorite={false}
                models={otherModels}
                toggleFavoriteModel={toggleFavoriteModel}
                handleSelectModel={handleSelectModel}
              />
            </div>
          ) : (
            <FavoriteModelsList
              favoriteModels={favoriteModels}
              handleSelectModel={handleSelectModel}
            />
          )}
        </div>
        <div className='flex flex-col gap-1 items-start'>
          <Separator />
          <Button
            onClick={() => setShowAll(!showAll)}
            className='font-semibold'
            variant='ghost'
          >
            {!showAll ? (
              <>
                <ChevronUp />
                Show All
              </>
            ) : (
              <>
                <ChevronLeft />
                Favorites
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
