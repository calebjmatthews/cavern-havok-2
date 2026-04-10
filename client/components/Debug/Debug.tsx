import TreasureSelect from "../Battle/TreasureSelect/TreasureSelect";

export default function Debug() {
  return (
    <section>
      <TreasureSelect
        treasures={[{ kind: 'cinders', quantity: 25 }]}
        onTreasureSelect={() => {}}
      />
    </section>
  );
}