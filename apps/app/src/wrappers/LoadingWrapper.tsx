import LoadingScreen from "src/components/LoadingScreen";

export default function LoadingWrapper({ children, loading }) {
  if (loading) {
    return <LoadingScreen />;
  }
  return children;
}
