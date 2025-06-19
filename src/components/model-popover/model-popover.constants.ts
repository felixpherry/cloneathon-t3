import { FaWind } from 'react-icons/fa';
import {
  RiChat1Fill,
  RiClaudeFill,
  RiFlowChart,
  RiGeminiFill,
  RiMetaFill,
  RiOpenaiFill,
  RiQuestionFill,
  RiSparkling2Fill,
  RiTwitterXFill,
} from 'react-icons/ri';

export const TOKENIZER_LOGO_MAP = {
  Other: RiQuestionFill,
  Gemini: RiGeminiFill,
  Mistral: FaWind,
  Qwen: RiQuestionFill,
  Qwen3: RiQuestionFill,
  DeepSeek: RiQuestionFill,
  Claude: RiClaudeFill,
  GPT: RiOpenaiFill,
  Llama3: RiMetaFill,
  Grok: RiTwitterXFill,
  Llama4: RiMetaFill,
  Cohere: RiChat1Fill,
  Nova: RiSparkling2Fill,
  Yi: RiQuestionFill,
  Llama2: RiMetaFill,
  Router: RiFlowChart,
} as const;
