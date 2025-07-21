export function extractPaymentInstrument(desc?: string): string | undefined {
  const match = desc?.match(/payment instrument\s*:\s*(\w+)/i);
  return match?.[1]?.toUpperCase();
}

export function extractBankName(desc?: string): string | undefined {
  const match = desc?.match(/bank\s*:\s*(\w+)/i);
  return match?.[1]?.toUpperCase();
}
