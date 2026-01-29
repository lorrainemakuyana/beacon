import { Image } from "react-native";
import Logo from "@/assets/images/logo.png";

export default function AuthHeader() {
  return <Image style={{ width: 50, height: 50 }} source={Logo} />;
}
