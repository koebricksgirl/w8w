import { Platform } from '../../types/platform';
import BaseNode from './BaseNode';

const nodeTypes = {
  [Platform.ResendEmail]: BaseNode,
  [Platform.Telegram]: BaseNode,
  [Platform.Gemini]: BaseNode,
  [Platform.Form]:  BaseNode,
  [Platform.Slack]: BaseNode,
  custom: BaseNode,
} as const;

export { nodeTypes };