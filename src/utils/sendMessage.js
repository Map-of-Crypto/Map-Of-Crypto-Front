import { WakuMessage } from 'js-waku';
import protobuf from 'protobufjs';

export const ContentTopic = `/relay-reactjs-chat/1/chat/proto`;
export const SimpleChatMessage = new protobuf.Type('SimpleChatMessage')
  .add(new protobuf.Field('timestamp', 1, 'uint64'))
  .add(new protobuf.Field('text', 2, 'string'));

export const sendMessage = (message, waku, timestamp) => {
  const time = timestamp.getTime();

  const protoMsg = SimpleChatMessage.create({
    timestamp: time,
    text: message,
  });
  const payload = SimpleChatMessage.encode(protoMsg).finish();

  return WakuMessage.fromBytes(payload, ContentTopic).then((wakuMessage) =>
    waku.relay.send(wakuMessage)
  );
};
