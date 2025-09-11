import { Platform } from '@w8w/db';
import BaseNode from './BaseNode';

const nodeTypes = {
  [Platform.ResendEmail]: BaseNode,
  [Platform.Telegram]: BaseNode,
  [Platform.Gemini]: BaseNode,
  custom: BaseNode,
} as const;

export { nodeTypes };