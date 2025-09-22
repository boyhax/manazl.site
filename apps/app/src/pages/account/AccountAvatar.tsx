import Avatar from "src/components/Avatar";
import { auth } from "src/state/auth";

export default function ({ ...props }) {
  const session = auth((s) => s.session);
  const avatar = session ? session.user.user_metadata?.avatar_url! : "";
  const name = session ? session.user.user_metadata?.full_name! : "";
  return <Avatar {...props} name={name} src={avatar}></Avatar>;
}
