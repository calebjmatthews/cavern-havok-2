import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

import type BattleState from "@common/models/battleState";
import type RouteParams from '@client/models/route_params';
import type SubCommandResolved from '../../../common/models/subCommandResolved';
import type Account from '@common/models/account';
import type Room from '@common/models/room';
import type SceneState from '@common/models/sceneState';
import type { TreasuresApplying } from '@common/models/treasuresApplying';
import type { Modal } from '@client/models/modal';
import Communication from "../Communication/Communication";
import ModalDisplay from '../ModalDisplay/ModalDisplay';
import MessageClient from "@common/communicator/message_client";
import { MESSAGE_KINDS } from '@common/enums';
import './main.css';

export default function Main() {
  const [account, setAccount] = useState<Account | null>(null);
  const [outgoingToAdd, setOutgoingToAdd] = useState<MessageClient | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [battleStateLast, setBattleStateLast] = useState<BattleState | null>(null);
  const [battleStateFuture, setBattleStateFuture] = useState<BattleState | null>(null);
  const [subCommandsResolved, setSubCommandsResolved] = useState<SubCommandResolved[] | null>(null);
  const [subCommandsResolvedFuture, setSubCommandsResolvedFuture]
    = useState<SubCommandResolved[] | null>(null);
  const [treasuresApplying, setTreasuresApplying] = useState<TreasuresApplying | null>(null);
  const [toCommand, setToCommand] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [sceneState, setSceneState] = useState<SceneState | null>(null);
  const [modals, setModals] = useState<Modal[]>([]);
  const [modalToAdd, setModalToAdd] = useState<Modal | null>(null);
  const [modalToRemove, setModalToRemove] = useState<Modal | null>(null);
  const navigate = useNavigate();
  const routeParams = useParams() as unknown as RouteParams;

  useEffect(() => {
    if (battleState?.battleId && !routeParams.battleId) {
      navigate(`/battle/${battleState.battleId}`);
    }
  }, [battleState, routeParams]);

  useEffect(() => {
    if (sceneState?.sceneId && !routeParams.sceneId) {
      navigate(`/scene/${sceneState.sceneId}`);
    }
  }, [sceneState, routeParams]);

  useEffect(() => {
    const inBattle = battleState?.battleId || routeParams.battleId;
    const inScene = sceneState?.sceneId || routeParams.sceneId;
    if (inBattle || inScene) return;
    if (room && !routeParams.roomId) {
      navigate(`/room/${room.id}`);
    }
    else if (!room && routeParams.roomId && account && !account.isGuest) {
      setOutgoingToAdd(new MessageClient({ accountId: account.id, payload: {
        kind: MESSAGE_KINDS.ROOM_JOIN_REQUEST,
        roomId: routeParams.roomId,
        accountId: account.id,
      } }));
    };
  }, [room, routeParams, account]);
  
  useEffect(() => {
    if (modalToAdd) {
      setModals([ ...modals, modalToAdd ]);
      setModalToAdd(null);
    };
  }, [modals, modalToAdd]);

  useEffect(() => {
    if (modalToRemove) {
      setModals(modals.filter((m) => m.id !== modalToRemove.id));
      setModalToRemove(null);
    };
  }, [modals, modalToRemove]);
  
  return (
    <main id="main">
      <section id="body">
        <Outlet context={{
          account,
          setOutgoingToAdd,
          battleState,
          setBattleState,
          battleStateLast,
          setBattleStateLast,
          battleStateFuture,
          setBattleStateFuture,
          subCommandsResolved,
          setSubCommandsResolved,
          subCommandsResolvedFuture,
          setSubCommandsResolvedFuture,
          toCommand,
          room,
          sceneState,
          treasuresApplying,
          setTreasuresApplying,
          setModalToAdd
        }} />
      </section>
      <footer>
        <Communication
          account={account}
          setAccount={setAccount}
          outgoingToAdd={outgoingToAdd}
          setOutgoingToAdd={setOutgoingToAdd}
          setBattleState={setBattleState}
          setBattleStateLast={setBattleStateLast}
          setBattleStateFuture={setBattleStateFuture}
          setSubCommandsResolved={setSubCommandsResolved}
          setSubCommandsResolvedFuture={setSubCommandsResolvedFuture}
          setTreasuresApplying={setTreasuresApplying}
          setToCommand={setToCommand}
          setRoom={setRoom}
          setSceneState={setSceneState}
        />
        <ModalDisplay modals={modals} setModalToRemove={setModalToRemove} />
      </footer>
    </main>
  );
};