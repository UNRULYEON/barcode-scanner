import { ReactNode, useEffect, useState } from "react";
import Button from "./Button";

const Row = ({ children }: { children: ReactNode }) => (
  <span className="flex flex-row items-center text-lg font-bold">
    {children}
  </span>
);

const Checkmark = () => (
  <span className="material-symbols-rounded mr-2 text-green-500">
    check_circle
  </span>
);

function App() {
  const [hidCompatible] = useState("hid" in navigator);

  const requestDevices = async () => {
    // const device = await navigator.hid.requestDevice({ filters: [] });
    // console.log(device);
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-stone-800 text-white">
      <div className="flex h-full max-h-[400px] w-full max-w-[300px] flex-col gap-4 rounded-xl  bg-stone-700 p-4">
        <Row>{hidCompatible && <Checkmark />}HID compatible</Row>
        <Button onClick={requestDevices}>Request Devices</Button>
      </div>
    </div>
  );
}

export default App;
