import type { TreasuresApplying } from "@common/models/treasuresApplying";

export default function TreasureOutcomes(props: {
  treasuresApplying: TreasuresApplying;
  readyForChamberNew: () => void
}) {
  const { treasuresApplying, readyForChamberNew } = props;
  return (
    <div id="battle-treasure-outcomes" className="bottom-container">
      {treasuresApplying.map((treasureApplied) => (
        <p>{treasureApplied.text}</p>
      ))}
      <button
        type="button"
        className="btn-large"
        onClick={readyForChamberNew}
      >
        {`Keep pressing onward!`}
      </button>
    </div>
  );
};