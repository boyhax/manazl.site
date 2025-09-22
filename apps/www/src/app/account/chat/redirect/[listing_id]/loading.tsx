import LoadingSpinnerComponent from "react-spinners-components";

export default async function chatRedirectloading({ }) {
  return <div className="p-10 flex items-center justify-center flex-col">
    <h3>Please Wait</h3>
    <LoadingSpinnerComponent type="Infinity" />

  </div>;
}
