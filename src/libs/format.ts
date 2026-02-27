export function formatLayerId (id: string | undefined) {
  return id === "" ? "[empty_string]" : `'${id}'`;
}
