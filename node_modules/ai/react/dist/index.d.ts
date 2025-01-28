import * as _ai_sdk_react from '@ai-sdk/react';
import { useChat as useChat$1, useCompletion as useCompletion$1, useAssistant as useAssistant$1 } from '@ai-sdk/react';
export { CreateMessage, Message, UseChatHelpers, UseChatOptions } from '@ai-sdk/react';

declare const useChat: typeof useChat$1;
declare const useCompletion: typeof useCompletion$1;
declare const useAssistant: typeof useAssistant$1;
declare const experimental_useObject: <RESULT, INPUT = any>({ api, id, schema, initialValue, fetch, onError, onFinish, headers, }: _ai_sdk_react.Experimental_UseObjectOptions<RESULT>) => _ai_sdk_react.Experimental_UseObjectHelpers<RESULT, INPUT>;

export { experimental_useObject, useAssistant, useChat, useCompletion };
