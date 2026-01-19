/**
 * Get the initials of a user
 * @param name - The name of the user
 * @returns The initials of the user
 */
export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
