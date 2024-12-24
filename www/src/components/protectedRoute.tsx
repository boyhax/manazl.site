export default function ProtectedRoute({
  check,
  fallback,
  children,
}: {
  check;
  fallback;
  children?;
}) {
  if (check) {
    return children;
  } else {
    return fallback;
  }
  return check ? children : fallback;
}
