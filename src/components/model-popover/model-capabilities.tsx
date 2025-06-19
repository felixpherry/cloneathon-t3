import { Model } from '@/trpc/routers/model.routers';
import AppTooltip from '../common/app-tooltip';
import { Image, Paperclip } from 'lucide-react';

export default function ModelCapabilities({
  model,
  size,
}: {
  model: Model;
  size: 'sm' | 'md';
}) {
  const iconSize = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <div className='flex items-center gap-2'>
      {model.architecture.input_modalities.includes('image') && (
        <AppTooltip
          trigger={
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image className={iconSize} />
          }
        >
          Supports image input (for visual tasks or analysis)
        </AppTooltip>
      )}
      {model.architecture.input_modalities.includes('file') && (
        <AppTooltip trigger={<Paperclip className={iconSize} />}>
          Supports file uploads (PDFs, DOCs, etc.)
        </AppTooltip>
      )}
    </div>
  );
}
