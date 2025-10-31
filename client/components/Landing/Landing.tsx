import MessageClient from "@common/communicator/message_client";
import { MESSAGE_KINDS } from "@common/enums";
import './landing.css';

export default function Landing(props: {
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void,
}) {
  const { setOutgoingToAdd } = props;

  const startBattleClick = () => {
    setOutgoingToAdd(new MessageClient({
      payload: {
        kind: MESSAGE_KINDS.REQUEST_NEW_BATTLE
      }
    }));
  };
  
  return (
    <section id="landing">
      <span className="title">{`Cavern Havok`}</span>
      <button className="btn-large" onClick={startBattleClick}>
        {`Start battle`}
      </button>
    </section>
  )
};