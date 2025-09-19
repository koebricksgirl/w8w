import { Platform } from '../../types/platform';
import BaseNode from './BaseNode';

const nodeTypes = {
  [Platform.ResendEmail]: BaseNode,
  [Platform.Telegram]: BaseNode,
  [Platform.Gemini]: BaseNode,
  [Platform.Form]:  BaseNode,
  custom: BaseNode,
} as const;

export { nodeTypes };