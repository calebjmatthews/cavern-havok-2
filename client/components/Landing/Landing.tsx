import { useState, type ChangeEvent } from 'react';
import { useOutletContext } from 'react-router';

import MessageClient from "@common/communicator/message_client";
import type OutletContext from '@client/models/outlet_context';
import { CHARACTER_CLASSES, MESSAGE_KINDS } from "@common/enums";
import './landing.css';
import { characterClasses } from '@common/instances/character_classes';

export default function Landing() {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState<CHARACTER_CLASSES | null>(null);
  const outletContext: OutletContext = useOutletContext();
  const { account, setOutgoingToAdd } = outletContext;

  // const startBattleClick = () => {
  //   setOutgoingToAdd(new MessageClient({
  //     accountId: accountId ?? undefined,
  //     payload: {
  //       kind: MESSAGE_KINDS.REQUEST_NEW_BATTLE
  //     }
  //   }));
  // };

  const claimAccountSubmit = (ev: ChangeEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!account || !characterClass) return;
    setOutgoingToAdd(new MessageClient({
      accountId: account.id,
      payload: {
        kind: MESSAGE_KINDS.CLAIM_GUEST_ACCOUNT,
        accountId: account.id,
        name,
        characterClass
      }
    }))
  };
  
  return (
    <section id="landing">
      <span className="title">{`Cavern Havok`}</span>
      {!account && (
        <span>Connecting...</span>
      )}

      {(account?.isGuest) && (
        <form className="claim-account" onSubmit={claimAccountSubmit}>
          <div className="claim-account-section">
            <div className="text-large">Who are you?</div>
            <input value={name} onChange={(ev) => setName(ev.target.value) } />
          </div>
          <div className="claim-account-section">
            <span className="text-large">How would you fight?</span>
            {Object.values(characterClasses).filter((cc) => cc.kind === 'character')
            .map((cc) => (
              <div key={cc.id} className="claim-account-character-class">
                <button
                  type='button'
                  onClick={() => setCharacterClass(cc.id)}
                  className={characterClass === cc.id ? "is-selected" : ""}
                >
                  {cc.id}
                </button>
                <span>{cc.description}</span>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="btn-large"
            disabled={!(name.length > 0 && characterClass)}
          >
            {`Go`}
          </button>
        </form>
      )}

      {(account && !account?.isGuest) && (
        <div className="text-large">{`Hi, ${account.name}.`}</div>
      )}
    </section>
  )
};