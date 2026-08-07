import { redirect } from "next/navigation";
import { MEMBER_LOGIN_PATH } from "@/lib/constants/member";

export default function LoginRedirectPage() {
  redirect(MEMBER_LOGIN_PATH);
}
