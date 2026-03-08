export function formatRelativeTime(iso: string | Date) {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  const deltaMs = Date.now() - date.getTime();
  const abs = Math.abs(deltaMs);

  const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [1000, 'second'],
    [60 * 1000, 'minute'],
    [60 * 60 * 1000, 'hour'],
    [24 * 60 * 60 * 1000, 'day'],
    [7 * 24 * 60 * 60 * 1000, 'week'],
    [30 * 24 * 60 * 60 * 1000, 'month'],
    [365 * 24 * 60 * 60 * 1000, 'year'],
  ];

  let unit: Intl.RelativeTimeFormatUnit = 'second';
  let value = Math.round(deltaMs / 1000);

  for (let i = 1; i < units.length; i++) {
    const [threshold, nextUnit] = units[i]!;
    if (abs < threshold) break;
    unit = nextUnit;
  }

  switch (unit) {
    case 'minute':
      value = Math.round(deltaMs / (60 * 1000));
      break;
    case 'hour':
      value = Math.round(deltaMs / (60 * 60 * 1000));
      break;
    case 'day':
      value = Math.round(deltaMs / (24 * 60 * 60 * 1000));
      break;
    case 'week':
      value = Math.round(deltaMs / (7 * 24 * 60 * 60 * 1000));
      break;
    case 'month':
      value = Math.round(deltaMs / (30 * 24 * 60 * 60 * 1000));
      break;
    case 'year':
      value = Math.round(deltaMs / (365 * 24 * 60 * 60 * 1000));
      break;
    default:
      value = Math.round(deltaMs / 1000);
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  return rtf.format(value, unit);
}

