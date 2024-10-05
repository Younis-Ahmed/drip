import { auth } from "@/server/auth";
import { UserBtn } from "@/components/navigation/userBtn";

export default async function Nav() {
    const session = await auth();
    console.log(session);

    return (
        <header className="bg-slate-500 py-4 ">
            <nav>
                <ul className="flex justify-between">
                    <li>Logos</li>
                    <li>
                        <UserBtn expires={session?.expires ?? ''} user={session?.user} />
                    </li>
                </ul>
            </nav>
        </header>
    )
}