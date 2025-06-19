import { Model } from '@/trpc/routers/model.routers';
import { RiQuestionFill } from 'react-icons/ri';
import { TOKENIZER_LOGO_MAP } from './model-popover.constants';

export const isModelFree = (model: Model) => model.id.endsWith(':free');
export const getTokenizerIcon = (tokenizer: string) => {
  return (
    TOKENIZER_LOGO_MAP[tokenizer as keyof typeof TOKENIZER_LOGO_MAP] ||
    RiQuestionFill
  );
};

export const filterModels = (models: Model[], searchTerm: string) => {
  return models.filter((model) =>
    model.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );
};

export const partitionModelsByFavorite = (
  models: Model[],
  favoriteModelIds: string[]
) => {
  const favoriteModels = models.filter((model) =>
    favoriteModelIds.includes(model.id)
  );
  const otherModels = models.filter(
    (model) => !favoriteModelIds.includes(model.id)
  );
  return {
    favoriteModels,
    otherModels,
  };
};
