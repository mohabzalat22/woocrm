export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function roleLabel(name: string) {
  return name.charAt(0) + name.slice(1).toLowerCase();
}

export function permissionLabel(name: string) {
  return name
    .split(":")
    .map((part) => part.replaceAll("_", " "))
    .join(" · ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function initials(name: string | null, email: string) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return email.slice(0, 2).toUpperCase();
}
