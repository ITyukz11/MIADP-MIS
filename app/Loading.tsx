import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Label } from "@/components/ui/label";
import { FaSpinner } from "react-icons/fa";

const Loading: React.FC = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <LoadingSpinner />
      <Label style={{ marginLeft: "8px", fontSize: "1.2rem" }}>Loading...</Label>
    </div>
  );
};

export default Loading;
