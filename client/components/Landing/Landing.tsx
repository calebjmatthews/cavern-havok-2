import MessageClient from "@common/communicator/message_client";
import { MESSAGE_KINDS } from "@common/enums";
import './landing.css';

export default function Landing(props: {
  accountId: string | null;
  setOutgoingToAdd: (nextOutgoingToAdd: MessageClient | null) => void,
}) {
  const { accountId, setOutgoingToAdd } = props;

  const startBattleClick = () => {
    setOutgoingToAdd(new MessageClient({
      accountId: accountId ?? undefined,
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