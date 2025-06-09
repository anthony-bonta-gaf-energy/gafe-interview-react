export function handleError(error: Error | unknown) {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  alert(message);
}
