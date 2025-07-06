"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { toast } from "sonner";


export function useRequireAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<null | { id: string; email: string }>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                router.push("/login");
                toast.warning('You must log in first.')
                return;
            }

            setUser({ id: data.user.id, email: data.user.email ?? "" });
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    return { user, isLoading };
}
