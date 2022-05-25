import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import { useEffect, useState, useCallback } from 'react';

import { Waku } from 'js-waku';
import { ContentTopic, sendMessage, SimpleChatMessage } from '../../utils';

export const Chat = ({ address }) => {
  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState('None');
  const [sendCounter, setSendCounter] = useState(0);
  const [messages, setMessages] = useState([]);

  const sendMessageOnClick = (message) => {
    if (wakuStatus !== 'Ready') return;

    message = `You said:\n ${message}`;
    const time = new Date();
    sendMessage(`${address}##&&^^${message}`, waku, time);

    const m = {
      text: message,
      timestamp: time,
      senderAddress: address,
      direction: 'outgoing',
    };

    setMessages((messages) => {
      return messages.concat(m);
    });

    setSendCounter(sendCounter + 1);
  };

  const processIncomingMessage = useCallback((wakuMessage) => {
    if (!wakuMessage.payload) return;

    const { text, timestamp } = SimpleChatMessage.decode(wakuMessage.payload);
    const fullText = text.split('##&&^^');
    const address = fullText[0];

    const msg = `${address.slice(0, 4)}...${address.slice(38, 42)} said:\n ${
      fullText[1]
    }`;

    console.log(fullText);

    const time = new Date();
    time.setTime(timestamp);

    const message = {
      text: msg,
      timestamp: time,
      senderAddress: address,
      direction: 'incoming',
    };

    setMessages((messages) => {
      return messages.concat(message);
    });
  }, []);

  useEffect(() => {
    if (!!waku) return;
    if (wakuStatus !== 'None') return;

    setWakuStatus('Starting');

    Waku.create({ bootstrap: { default: true } }).then((waku) => {
      setWaku(waku);
      setWakuStatus('Connecting');
      waku.waitForRemotePeer().then(() => {
        setWakuStatus('Ready');
      });
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (!waku) return;

    waku.relay.addObserver(processIncomingMessage, [ContentTopic]);

    return function cleanUp() {
      waku.relay.deleteObserver(processIncomingMessage, [ContentTopic]);
    };
  }, [waku, wakuStatus, processIncomingMessage]);

  return (
    <div style={{ flex: 1, backgroundColor: '#151515' }}>
      <MainContainer>
        <ChatContainer style={{ backgroundColor: '#151515' }}>
          <MessageList scrollBehavior='smooth'>
            {messages.map((m, i) => (
              <Message
                key={i}
                model={{
                  message: m.text,
                  sentTime: m.timestamp.toString(),
                  sender: m.senderAddress,
                  direction: m.direction,
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder='Type message here'
            onSend={sendMessageOnClick}
            disabled={wakuStatus !== 'Ready'}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
