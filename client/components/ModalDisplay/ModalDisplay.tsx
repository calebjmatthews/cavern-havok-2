import type Artist from "@client/models/artist/artist";
import type { Modal } from "@client/models/modal";
import OccupantDetail from "../OccupantDetail/OccupantDetail";
import { MODAL_KINDS } from "@client/enums";
import "./modalDisplay.css";

export default function ModalDisplay(props: {
  modals: Modal[],
  setModalToRemove: (modal: Modal) => void,
  artist: Artist
}) {
  const { modals, setModalToRemove, artist } = props;

  if (modals.length === 0) return null;

  return (<>
    {modals.map((modal) => (
      <div key={`modal-${modal.id}`} className="modal-container">
        <button
          role="button"
          onClick={() => setModalToRemove(modal)}
          className="modal-background non-btn"
        />
        <div className="modal-wrapper">
          <div className="modal-shell">
            <button
              role="button"
              className="btn-modal-close"
              onClick={() => setModalToRemove(modal)}
            >
              X
            </button>
            <ModalContent modal={modal} artist={artist} />
          </div>
        </div>
      </div>
    ))}
  </>)
};

function ModalContent(props: {
  modal: Modal,
  artist: Artist
}) {
  const { modal, artist } = props;

  switch (modal.kind) {
    case MODAL_KINDS.OCCUPANT_DETAIL:
      return (
        <OccupantDetail battleState={modal.battleState} occupant={modal.occupant} artist={artist} />
      );

    default:
      console.log(`Modal kind ${modal.kind} not found.`)
  }
  return null;
};