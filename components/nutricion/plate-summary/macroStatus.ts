export const DEFAULT_FAT_ABS_MAX = 90;
export const DEFAULT_FAT_MIN = 55;
export const DEFAULT_CARB_ABS_MAX = 225;
export const DEFAULT_CARB_MIN = 140;

export const getMacroStatus = (
  currentTotal: number,
  ideal: number,
  min: number,
  absoluteMax: number,
  dynamicLimit: number
) => {
  const isBelowMin = dynamicLimit < min;
  const isSqueezed = dynamicLimit < ideal;

  const ceiling = Math.min(absoluteMax, dynamicLimit);
  const isFlexing = !isSqueezed && currentTotal > ideal && currentTotal <= ceiling;
  const isOverLimit = currentTotal > ceiling;

  const displayLimit = currentTotal <= ideal && !isSqueezed ? ideal : ceiling;
  const displayRemaining = displayLimit - currentTotal;

  let statusText = '';
  let statusColor = 'text-text-secondary';

  if (isOverLimit) {
    statusText = 'EXCEDIDO';
    statusColor = 'text-red-500';
  } else if (isBelowMin) {
    statusText = 'DIFICIT CRITICO';
    statusColor = 'text-yellow-500';
  } else if (isFlexing) {
    statusText = 'FLEX';
    statusColor = 'text-orange-400';
  } else if (isSqueezed) {
    statusText = 'REDUCIDO';
    statusColor = 'text-text-primary';
  }

  return {
    statusText,
    statusColor,
    remaining: displayRemaining,
    displayLimit,
    ceiling,
    isBelowMin,
    isSqueezed,
    isFlexing,
    isOverLimit,
  };
};
