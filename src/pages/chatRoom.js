import { Container } from '../components/SignIn/SigninElements';
import { Chat } from '../components/Chat/chat';

export const ChatRoom = ({ address }) => {
  return (
    <div style={{ display: "flex", flex: 1, backgroundColor: "#151515" }}>
      <Chat address={address} />
    </div>
  );
};
