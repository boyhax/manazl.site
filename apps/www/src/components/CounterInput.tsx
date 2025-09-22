'use client'
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";

export default function CounterInput({
  value,
  onChange,
  min,
  max
}: {
  min?: number, max?: number,
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={"flex flex-row items-center justify-between space-x-1"}>
      <CiCircleChevDown
        onClick={() => min ? value <= min ? null : onChange(value - 1) : onChange(value - 1)}
        size="2rem"
        className={"active:text-blue-500"}
      />
      <strong>{value}</strong>
      <CiCircleChevUp
        onClick={() => max ? value >= max ? null : onChange(value + 1) : onChange(value + 1)}
        size="2rem"
        className={"active:text-blue-500"}
      />
    </div>
  );
}
