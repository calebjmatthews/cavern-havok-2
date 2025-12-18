import type Creation from "@common/models/creation";
import type Fighter from "@common/models/fighter";
import type Obstacle from "@common/models/obstacle";
import type Equipment from "@common/models/equipment";
import type BattleState from "@common/models/battleState";
import type { MODAL_KINDS } from "@client/enums";

export type Modal = ModalOccupantDetail | ModalEquipmentDetail;

export interface ModalOccupantDetail {
  id: string,
  kind: MODAL_KINDS.OCCUPANT_DETAIL,
  battleState?: BattleState,
  occupant: Fighter | Creation | Obstacle
};

export interface ModalEquipmentDetail {
  id: string,
  kind: MODAL_KINDS.EQUIPMENT_DETAIL,
  equipment: Equipment
};