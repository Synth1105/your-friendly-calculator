import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Calculator,
  head: () => ({
    meta: [
      { title: "Calculator" },
      { name: "description", content: "A simple, elegant calculator." },
    ],
  }),
});

type Op = "+" | "-" | "×" | "÷" | null;

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<Op>(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d: string) => {
    if (waiting) {
      setDisplay(d);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  };

  const inputDot = () => {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaiting(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const compute = (a: number, b: number, op: Op): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const performOperator = (nextOp: Op) => {
    const value = parseFloat(display);
    if (previous === null) {
      setPrevious(value);
    } else if (operator && !waiting) {
      const result = compute(previous, value, operator);
      setDisplay(String(result));
      setPrevious(result);
    }
    setOperator(nextOp);
    setWaiting(true);
  };

  const equals = () => {
    if (operator === null || previous === null) return;
    const result = compute(previous, parseFloat(display), operator);
    setDisplay(String(result));
    setPrevious(null);
    setOperator(null);
    setWaiting(true);
  };

  const Btn = ({
    label,
    onClick,
    variant = "secondary",
    className = "",
  }: {
    label: string;
    onClick: () => void;
    variant?: "secondary" | "default" | "outline";
    className?: string;
  }) => (
    <Button
      variant={variant}
      onClick={onClick}
      className={`h-16 text-xl font-medium ${className}`}
    >
      {label}
    </Button>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm p-6 shadow-xl">
        <h1 className="sr-only">Calculator</h1>
        <div className="mb-4 rounded-lg bg-muted p-6 text-right">
          <div className="truncate text-4xl font-semibold tabular-nums text-foreground">
            {display}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Btn label="AC" onClick={clear} variant="outline" />
          <Btn label="+/-" onClick={toggleSign} variant="outline" />
          <Btn label="%" onClick={percent} variant="outline" />
          <Btn label="÷" onClick={() => performOperator("÷")} variant="default" />

          <Btn label="7" onClick={() => inputDigit("7")} />
          <Btn label="8" onClick={() => inputDigit("8")} />
          <Btn label="9" onClick={() => inputDigit("9")} />
          <Btn label="×" onClick={() => performOperator("×")} variant="default" />

          <Btn label="4" onClick={() => inputDigit("4")} />
          <Btn label="5" onClick={() => inputDigit("5")} />
          <Btn label="6" onClick={() => inputDigit("6")} />
          <Btn label="-" onClick={() => performOperator("-")} variant="default" />

          <Btn label="1" onClick={() => inputDigit("1")} />
          <Btn label="2" onClick={() => inputDigit("2")} />
          <Btn label="3" onClick={() => inputDigit("3")} />
          <Btn label="+" onClick={() => performOperator("+")} variant="default" />

          <Btn label="0" onClick={() => inputDigit("0")} className="col-span-2" />
          <Btn label="." onClick={inputDot} />
          <Btn label="=" onClick={equals} variant="default" />
        </div>
      </Card>
    </main>
  );
}
